import { Types } from "mongoose";
import Session from "../../../domain/entities/session.entity";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import { SessionModel, ISessionDocument } from "../models/SessionModel";
import { BaseRepository } from "./BaseRepository";

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
      session.videoRoomId,
      session.progressNotesId
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
        (transactionId: string) => new Types.ObjectId(transactionId)
      ),
      status: entity.status,
      fees: entity.fees,
      videoRoomId: entity.videoRoomId,
      progressNotesId: entity.progressNotesId,
      _id: entity.id ? new Types.ObjectId(entity.id) : undefined,
    };
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
    return sessions.map((doc: ISessionDocument) => this.toDomain(doc));
  }
  async findSessionByPsychStartTime(
    startTime: Date,
    psychId: string
  ): Promise<Session | null> {
    const session = await this.model.findOne({
      startTime: startTime,
      psychologist: new Types.ObjectId(psychId),
    });
    if (!session) {
      return null;
    }
    return this.toDomain(session);
  }

  async listSessionsByUser(userId: string): Promise<Session[]> {
    const sessions = await this.model
      .find({ user: new Types.ObjectId(userId) })
      .sort({ startTime: -1 }); 
    return sessions.map((doc: ISessionDocument) => this.toDomain(doc));
  }

  async listSessionsByPsych(psychId: string): Promise<Session[]> {
    const sessions = await this.model
      .find({ psychologist: new Types.ObjectId(psychId) })
      .sort({ startTime: -1 }); 
    return sessions.map((doc: ISessionDocument) => this.toDomain(doc));
  }

  async listSessionsByAdmin(status: string): Promise<Session[]> {
    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    const sessions = await this.model.find(filter).sort({ startTime: -1 });
    return sessions.map((doc: ISessionDocument) => this.toDomain(doc));
  }
}
