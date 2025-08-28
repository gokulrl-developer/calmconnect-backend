import { Application } from "../entities/application.entity";
import IBaseRepository from "./IBaseRepository";


export default interface IApplicationRepository extends IBaseRepository<Application>{
    findLatestByPsychId(psychId: string): Promise<Application | null>;
    findAllByPsychId(psychId: string): Promise<Application[]>;
    findPendingApplications(skip:number,limit:number,search:string|null):Promise<Application[]>;
    findPendingApplicationById(id:string):Promise<Application | null>
}