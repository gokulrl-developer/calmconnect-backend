import { Application } from "../entities/application.entity";
import IBaseRepository from "./IBaseRepository";


export default interface IApplicationRepository extends IBaseRepository<Application>{
    findLatestByPsychId(psychId: string): Promise<Application | null>;
    findAllByPsychId(psychId: string): Promise<Application[]>;
    listApplications(skip:number,limit:number,search:string|null,status?:"pending"|"accepted"|"rejected"):Promise<Application[]>;
    findApplicationById(id:string):Promise<Application | null>
}