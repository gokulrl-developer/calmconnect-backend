import { ApplicationDetailsDTO } from "../dtos/admin.dto"

export interface ApplicationDetails{
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
   
}

export default interface IApplicationDetailsUseCase{
    execute(dto:ApplicationDetailsDTO):Promise<ApplicationDetails>
}