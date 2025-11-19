import { Types } from "mongoose";
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
      _id: entity.id ? new Types.ObjectId(entity.id) : undefined,
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
      status: "scheduled",
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
  ): Promise<{ sessions: Session[]; totalItems: number }> {
    const filter: any = { user: new Types.ObjectId(userId) };
    if (status) {
      filter.status = status;
    }
    const [sessions, totalItems] = await Promise.all([
      this.model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit),
      this.model.countDocuments({ user: new Types.ObjectId(userId) }),
    ]);

    return {
      sessions: sessions.map((doc) => this.toDomain(doc)),
      totalItems,
    };
  }

  async listSessionsByPsych(
    psychId: string,
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItems: number }> {
    const filter: any = { psychologist: new Types.ObjectId(psychId) };
    if (status) {
      filter.status = status;
    }
    const [sessions, totalItems] = await Promise.all([
      this.model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit),
      this.model.countDocuments({ psychologist: new Types.ObjectId(psychId) }),
    ]);

    return {
      sessions: sessions.map((doc) => this.toDomain(doc)),
      totalItems,
    };
  }

  async listSessionsByAdmin(
    status: string,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; totalItems: number }> {
    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    const [sessions, totalItems] = await Promise.all([
      this.model.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    console.log("sessions", sessions);
    return {
      sessions: sessions.map((doc) => this.toDomain(doc)),
      totalItems,
    };
  }

  async fetchSessionTrends(
    fromDate: Date,
    toDate: Date,
    interval: "day" | "month" | "year"
  ): Promise<SessionTrendsEntry[]> {
    const dateFormat =
      interval === "day"
        ? { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } }
        : interval === "month"
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
          sessions: { $sum: 1 },
          cancelledSessions: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      label: r._id,
      sessions: r.sessions,
      cancelledSessions: r.cancelledSessions,
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

    const [totalValue, addedValue] = await Promise.all([
      totalValuePromise,
      addedValuePromise,
    ]);

    return { totalValue, addedValue };
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

    const filled: PsychSessionTrendsEntry[] = [];
    let currentWeekDate = startOfWeek(endDate, { weekStartsOn: 1 });

    for (let i = 3; i >= 0; i--) {
      const weekDate = subWeeks(currentWeekDate, i);
      const weekNum = this.getISOWeek(weekDate);
      const found = results.find((r) => r._id === weekNum);

      filled.push({
        week: `Week ${weekNum}`,
        sessions: found ? found.sessions : 0,
      });
    }

    return filled;
  }

  async fetchRecentSessionsByPsych(
    psychId: string
  ): Promise<RecentSessionEntryFromPersistence[]> {
    const now = new Date();

    const results = await this.model.aggregate([
      {
        $match: {
          psychologist: new Types.ObjectId(psychId),
          status: { $in: ["scheduled", "cancelled", "ended", "pending"] },
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
      todaySessions,
      upcomingSessions,
      nextSession,
      totalSessions,
      thisMonthSessions,
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
      todaySessions,
      upcomingSessions,
      nextSessionTime: nextSession ? nextSession.startTime : null,
      totalSessions,
      thisMonthSessions,
    };
  }

  async fetchUserSessionSummary(
    userId: string
  ): Promise<UserSessionSummaryFromPersistence> {
    const userObjectId = new Types.ObjectId(userId);

    const [
      totalSessions,
      completedSessions,
      upcomingSessions,
      cancelledSessions,
    ] = await Promise.all([
      this.model.countDocuments({ user: userObjectId }),
      this.model.countDocuments({ user: userObjectId, status: "ended" }),
      this.model.countDocuments({ user: userObjectId, status: "scheduled" }),
      this.model.countDocuments({ user: userObjectId, status: "cancelled" }),
    ]);

    return {
      totalSessions,
      completedSessions,
      upcomingSessions,
      cancelledSessions,
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
          status: { $in: ["scheduled", "cancelled", "ended", "pending"] },
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
          time: "$startTime",
          status: 1,
        },
      },
      { $limit: limit },
    ]);

    return results;
  }
}
