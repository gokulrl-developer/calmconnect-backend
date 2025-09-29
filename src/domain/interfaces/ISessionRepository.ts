import Session from "../entities/session.entity";
import IBaseRepository from "./IBaseRepository";

export default interface ISessionRepository extends IBaseRepository<Session>{
   findBookedSessions(date:Date,psychId:string):Promise<Session[]>
}