import Session from "../entities/session.entity";
import IBaseRepository from "./IBaseRepository";

export default interface ISessionRepository extends IBaseRepository<Session>{
   findBookedSessions(date:Date,psychId:string):Promise<Session[]>,
   findSessionByPsychStartTime(startTime:Date,psychId:string):Promise<Session | null>,
   listSessionsByUser(userId:string):Promise<Session[]>,
   listSessionsByPsych(userId:string):Promise<Session[]>,
   listSessionsByAdmin(status:string):Promise<Session[]>,
}