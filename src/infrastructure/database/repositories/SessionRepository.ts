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
      session.startTime.toISOString(),
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
      startTime: new Date(entity.startTime!),
      durationInMins: entity.durationInMins,
      transactionIds: entity.transactionIds?.map((transactionId:string)=>new Types.ObjectId(transactionId)),
      status: entity.status,
      fees: entity.fees,
      videoRoomId: entity.videoRoomId,
      progressNotesId: entity.progressNotesId,
      _id: entity.id ? new Types.ObjectId(entity.id) : undefined,
    };
  }
  async findBookedSessions(date: Date,psychId:string): Promise<Session[]> {
      const sessions=await this.model.find({date:date,status:"sheduled",psychologist:psychId});
      return sessions.map((doc:ISessionDocument)=>this.toDomain(doc))
  }
}
