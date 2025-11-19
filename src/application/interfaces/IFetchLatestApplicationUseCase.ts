import { PsychApplicationStatusDTO } from "../dtos/psych.dto.js";

export interface LatestApplicationData{
    firstName:string,
    lastName:string,
    email:string,
    submittedAt:Date, 
    phone:string, 
    gender:"male"|"female"|"others",
    dob:Date,
    profilePicture:string,
    address:string,
    languages:string,
    specializations:string[],
    bio:string,
    licenseUrl:string,
    resume:string,
    qualifications:string,
    status:"pending"|"accepted"|"rejected",
    rejectionReason?:string
}

export default interface IFetchLatestApplicationUseCase{
    execute(dto:PsychApplicationStatusDTO):Promise<{application:LatestApplicationData|null}>
}