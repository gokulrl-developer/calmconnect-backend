import { FilterQuery, Types } from "mongoose";
import Session from "../../../domain/entities/session.entity.js";
import ISessionRepository, {
  PsychSessionSummaryFromPersistence,
  PsychSessionTrendsEntry,
  RecentSessionEntryFromPersistence,
  RecentUserSessionEntryFromPersistence,
  SessionTrendsEntry,
  SessionTrendsSummary,
  TopPsychologistsEntryFromPersistence,
  UserSessionSummaryFromPersistence,
} from "../../../domain/interfaces/ISessionRepository.js";
import { SessionModel, ISessionDocument } from "../models/SessionModel.js";
import { BaseRepository } from "./BaseRepository.js";
import { startOfWeek, subWeeks } from "date-fns";
import { SessionStatus } from "../../../domain/enums/SessionStatus.js";
import { SessionTrendsByAdminInterval } from "../../../domain/enums/SessionTrendsByAdminInterval.js";

export default class SessionRepository
  extends BaseRepository<Session, ISessionDocument>
  implements ISessionRepository
{
  constructor() {
    super(SessionModel);
  }

  protected toDomain(doc: ISessionDocument): Session {
    const session = doc.toObject();
    return new Session(
      session.psychologist.toString(),
      session.user.toString(),
      session.startTime,
      session.endTime,
      session.durationInMins,
      session.transactionIds,
      session.status,
      session.fees,
      session._id.toString(),
      session.videoRoomId
    );
  }

  protected toPersistence(entity: Partial<Session>): Partial<ISessionDocument> {
    return {
      psychologist: new Types.ObjectId(entity.psychologist),
      user: new Types.ObjectId(entity.user),
      startTime: entity.startTime!,
      endTime: entity.endTime!,
      durationInMins: entity.durationInMins,
      transactionIds: entity.transactionIds?.map(
        (id: string) => new Types.ObjectId(id)
      ),
      status: entity.status,
      fees: entity.fees,
      videoRoomId: entity.videoRoomId,
      _id: entity.sessionId ? new Types.ObjectId(entity.sessionId) : undefined,
    };
  }
  getISOWeek(date: Date): number {
    const temp = new Date(date.getTime());
    temp.setHours(0, 0, 0, 0);
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
    const week1 = new Date(temp.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((temp.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }
  async findBookedSessions(date: Date, psychId: string): Promise<Session[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await this.model.find({
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: SessionStatus.SCHEDULED,
      psychologist: new Types.ObjectId(psychId),
    });

    return sessions.map((doc) => this.toDomain(doc));
  }

  async findSessionByPsychStartTime(
    startTime: Date,
    psychId: string
  ): Promise<Session | null> {
    const session = await this.model.findOne({
      startTime,
      psychologist: new Types.ObjectId(psychId),
    });
    return session ? this.toDomain(session) : null;
  }

  async listSessionsByUser(
    userId: string,
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItemCount: number }> {
    type SessionFilter = FilterQuery<Session>;

    const filter: SessionFilter = { user: new Types.ObjectId(userId) };
    if (status) {
      filter.status = status;
    }
    const [sessions, totalItemCount] = await Promise.all([
      this.model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit),
      this.model.countDocuments({ user: new Types.ObjectId(userId) }),
    ]);

    return {
      sessions: sessions.map((doc) => this.toDomain(doc)),
      totalItemCount,
    };
  }

  async listSessionsByPsych(
    psychId: string,
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItemCount: number }> {
    type SessionFilter = FilterQuery<Session>;

    const filter: SessionFilter = { psychologist: new Types.ObjectId(psychId) };
    if (status) {
      filter.status = status;
    }
    const [sessions, totalItemCount] = await Promise.all([
      this.model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit),
      this.model.countDocuments({ psychologist: new Types.ObjectId(psychId) }),
    ]);

    return {
      sessions: sessions.map((doc) => this.toDomain(doc)),
      totalItemCount,
    };
  }

  async listSessionsByAdmin(
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItemCount: number }> {
    type SessionFilter = FilterQuery<Session>;
    const filter: SessionFilter = {};
    if (status) {
      filter.status = status;
    }
    const [sessions, totalItemCount] = await Promise.all([
      this.model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return {
      sessions: sessions.map((doc) => this.toDomain(doc)),
      totalItemCount,
    };
  }

  async fetchSessionTrends(
    fromDate: Date,
    toDate: Date,
    interval: SessionTrendsByAdminInterval
  ): Promise<SessionTrendsEntry[]> {
    const dateFormat =
      interval === SessionTrendsByAdminInterval.DAY
        ? { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } }
        : interval === SessionTrendsByAdminInterval.MONTH
        ? { $dateToString: { format: "%Y-%m", date: "$startTime" } }
        : { $dateToString: { format: "%Y", date: "$startTime" } };

    const results = await this.model.aggregate([
      {
        $match: {
          startTime: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: dateFormat,
          sessionCount: { $sum: 1 },
          cancelledSessionCount: {
            $sum: {
              $cond: [{ $eq: ["$status", SessionStatus.CANCELLED] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      label: r._id,
      sessionCount: r.sessionCount,
      cancelledSessionCount: r.cancelledSessionCount,
    }));
  }

  async findTopBySessionCount(
    fromDate: Date,
    toDate: Date,
    limit: number
  ): Promise<TopPsychologistsEntryFromPersistence[]> {
    const results = await this.model.aggregate([
      {
        $match: {
          startTime: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: "$psychologist",
          sessionCount: { $sum: 1 },
        },
      },
      {
        $sort: { sessionCount: -1 },
      },
      { $limit: limit },
      {
        $lookup: {
          from: "psychologists",
          localField: "_id",
          foreignField: "_id",
          as: "psychologistData",
        },
      },
      { $unwind: "$psychologistData" },
      {
        $project: {
          id: "$psychologistData._id",
          firstName: "$psychologistData.firstName",
          lastName: "$psychologistData.lastName",
          email: "$psychologistData.email",
          profilePicture: "$psychologistData.profilePicture",
          sessionCount: 1,
        },
      },
    ]);
    return results;
  }

  async fetchSessionTrendsSummary(
    fromDate: Date,
    toDate: Date
  ): Promise<SessionTrendsSummary> {
    const totalValuePromise = this.model.countDocuments().exec();
    const addedValuePromise = this.model
      .countDocuments({
        startTime: { $gte: fromDate, $lte: toDate },
      })
      .exec();

    const [totalSessionCount, addedSessionCount] = await Promise.all([
      totalValuePromise,
      addedValuePromise,
    ]);

    return { totalSessionCount, addedSessionCount };
  }

  async fetchPsychSessionTrends(
    psychId: string
  ): Promise<PsychSessionTrendsEntry[]> {
    const endDate = new Date();
    const startDate = subWeeks(startOfWeek(endDate, { weekStartsOn: 1 }), 4);

    const results = await this.model.aggregate([
      {
        $match: {
          psychologist: new Types.ObjectId(psychId),
          startTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $isoWeek: "$startTime" },
          sessions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const filledEntries: PsychSessionTrendsEntry[] = [];
    const currentWeekDate = startOfWeek(endDate, { weekStartsOn: 1 });

    for (let i = 3; i >= 0; i--) {
      const weekDate = subWeeks(currentWeekDate, i);
      const weekNum = this.getISOWeek(weekDate);
      const found = results.find((r) => r._id === weekNum);

      filledEntries.push({
        week: `Week ${weekNum}`,
        sessionCount: found ? found.sessions : 0,
      });
    }

    return filledEntries;
  }

  async fetchRecentSessionsByPsych(
    psychId: string
  ): Promise<RecentSessionEntryFromPersistence[]> {
    const now = new Date();

    const results = await this.model.aggregate([
      {
        $match: {
          psychologist: new Types.ObjectId(psychId),
          status: { $in: Object.values(SessionStatus) },
        },
      },
      {
        $addFields: {
          timeDiff: { $abs: { $subtract: ["$startTime", now] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      { $sort: { timeDiff: 1 } },
      {
        $project: {
          sessionId: "$_id",
          firstName: "$userData.firstName",
          lastName: "$userData.lastName",
          profilePicture: "$userData.profilePicture",
          startTime: "$startTime",
          status: 1,
        },
      },
      { $limit: 5 },
    ]);

    return results;
  }

  async fetchSessionSummaryByPsych(
    psychId: string
  ): Promise<PsychSessionSummaryFromPersistence> {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todaySessionCount,
      upcomingSessionCount,
      nextSession,
      totalSessionCount,
      thisMonthSessionCount,
    ] = await Promise.all([
      this.model.countDocuments({
        psychologist: new Types.ObjectId(psychId),
        startTime: { $gte: startOfToday },
      }),
      this.model.countDocuments({
        psychologist: new Types.ObjectId(psychId),
        startTime: { $gt: now },
      }),
      this.model
        .findOne({
          psychologist: new Types.ObjectId(psychId),
          startTime: { $gt: now },
        })
        .sort({ startTime: 1 })
        .select("startTime"),
      this.model.countDocuments({ psychologist: new Types.ObjectId(psychId) }),
      this.model.countDocuments({
        psychologist: new Types.ObjectId(psychId),
        startTime: { $gte: startOfMonth },
      }),
    ]);

    return {
      todaySessionCount,
      upcomingSessionCount,
      nextSessionTime: nextSession ? nextSession.startTime : null,
      totalSessionCount,
      thisMonthSessionCount,
    };
  }

  async fetchUserSessionSummary(
    userId: string
  ): Promise<UserSessionSummaryFromPersistence> {
    const userObjectId = new Types.ObjectId(userId);

    const [
      totalSessionCount,
      completedSessionCount,
      upcomingSessionCount,
      cancelledSessionCount,
    ] = await Promise.all([
      this.model.countDocuments({ user: userObjectId }),
      this.model.countDocuments({ user: userObjectId, status: SessionStatus.ENDED }),
      this.model.countDocuments({ user: userObjectId, status: SessionStatus.SCHEDULED }),
      this.model.countDocuments({ user: userObjectId, status: SessionStatus.CANCELLED }),
    ]);

    return {
      totalSessionCount,
      completedSessionCount,
      upcomingSessionCount,
      cancelledSessionCount,
    };
  }

  async fetchRecentUserSessionSummaries(
    userId: string,
    limit: number
  ): Promise<RecentUserSessionEntryFromPersistence[]> {
    const now = new Date();

    const results = await this.model.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId),
          status: { $in: Object.values(SessionStatus) },
        },
      },
      {
        $addFields: {
          timeDiff: { $abs: { $subtract: ["$startTime", now] } },
        },
      },
      {
        $lookup: {
          from: "psychologists",
          localField: "psychologist",
          foreignField: "_id",
          as: "psychologistData",
        },
      },
      { $unwind: "$psychologistData" },
      { $sort: { timeDiff: 1 } },
      {
        $project: {
          sessionId: "$_id",
          firstName: "$psychologistData.firstName",
          lastName: "$psychologistData.lastName",
          profilePicture: "$psychologistData.profilePicture",
          startTime:"$startTime",
          time: "$startTime",
          status: 1,
        },
      },
      { $limit: limit },
    ]);

    return results;
  }
}
