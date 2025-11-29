import { ApplicationStatus } from "../../domain/enums/ApplicationStatus.js"
import { PsychologistGender } from "../../domain/enums/PsychologistGender.js"
import { PsychologistStatus } from "../../domain/enums/PsychologistStatus.js"
import { ApplicationDetailsDTO } from "../dtos/admin.dto.js"

export interface ApplicationDetails{
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
   
}

export default interface IApplicationDetailsUseCase{
    execute(dto:ApplicationDetailsDTO):Promise<ApplicationDetails>
}