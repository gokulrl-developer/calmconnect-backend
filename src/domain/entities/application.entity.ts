import { ApplicationStatus } from "../enums/ApplicationStatus.js";
import { PsychologistGender } from "../enums/PsychologistGender.js";

export class Application {
  constructor(
    public psychologist:string,
    public firstName:string,
    public lastName:string,
    public email:string,
    public isVerified:boolean,
    public submittedAt:Date, 
    public phone:string, 
    public gender:PsychologistGender,
    public dob:Date,
    public profilePicture:string,
    public address:string,
    public walletBalance:number,
    public languages:string,
    public specializations:string[],
    public bio:string,
    public licenseUrl:string,
    public resume:string,
    public qualifications:string,
    public status:ApplicationStatus,
    public rejectionReason?:string,
    public password?:string,
    public hourlyFees?:number,
    public id?:string,
    public avgRating?:number,
    public createdAt?:Date
  ) {}

}

