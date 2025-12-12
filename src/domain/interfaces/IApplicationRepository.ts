import { Application } from "../entities/application.entity.js";
import { ApplicationStatus } from "../enums/ApplicationStatus.js";
import IBaseRepository from "./IBaseRepository.js";


export default interface IApplicationRepository extends IBaseRepository<Application>{
    findLatestByPsychId(psychId: string): Promise<Application | null>;
    findAllByPsychId(psychId: string): Promise<Application[]>;
    listApplications(skip:number,limit:number,search:string|null,status?:ApplicationStatus):Promise<Application[]>;
    findApplicationById(id:string):Promise<Application | null>
}