import { ApplicationStatus } from "../../domain/enums/ApplicationStatus.js";
import { PsychologistGender } from "../../domain/enums/PsychologistGender.js";
import { PsychApplicationStatusDTO } from "../dtos/psych.dto.js";

export interface LatestApplicationData{
    firstName:string,
    lastName:string,
    email:string,
    submittedAt:Date, 
    phone:string, 
    gender:PsychologistGender,
    dob:Date,
    profilePicture:string,
    address:string,
    languages:string,
    specializations:string[],
    bio:string,
    licenseUrl:string,
    resume:string,
    qualifications:string,
    status:ApplicationStatus,
    rejectionReason?:string
}

export default interface IFetchLatestApplicationUseCase{
    execute(dto:PsychApplicationStatusDTO):Promise<{application:LatestApplicationData|null}>
}