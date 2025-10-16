import Session from "../entities/session.entity";
import IBaseRepository from "./IBaseRepository";

export default interface ISessionRepository extends IBaseRepository<Session>{
   findBookedSessions(date:Date,psychId:string):Promise<Session[]>,
   findSessionByPsychStartTime(startTime:Date,psychId:string):Promise<Session | null>,
   listSessionsByUser(userId:string,status:string,skip:number,limit:number):Promise<{sessions:Session[],totalItems:number}>,
   listSessionsByPsych(userId:string,status:string,skip:number,limit:number):Promise<{sessions:Session[],totalItems:number}>,
   listSessionsByAdmin(status:string,skip:number,limit:number):Promise<{sessions:Session[],totalItems:number}>,
}