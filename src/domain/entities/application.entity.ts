
export class Application {
  constructor(
    public psychologist:string,
    public firstName:string,
    public lastName:string,
    public email:string,
    public isVerified:boolean,
    public submittedAt:Date, 
    public phone:string, 
    public gender:"male"|"female"|"others",
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
    public status:"pending"|"accepted"|"rejected",
    public rejectionReason?:string,
    public password?:string,
    public hourlyFees?:number,
    public id?:string,
    public avgRating?:number,
    public createdAt?:Date
  ) {}

}

export interface ApplicationRawDatabase{
    psychologist:string,
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    isVerified:boolean,
    submittedAt:Date, 
    phone:string, 
    gender:"male"|"female"|"others",
    dob:Date,
    profilePicture:string,
    address:string,
    walletBalance:number,
    languages:string,
    specializations:string[],
    bio:string,
    licenseUrl:string,
    resume:string,
    qualifications:string,
    hourlyFees?:number,
    status:"pending"|"accepted"|"rejected",
    rejectionReason?:string,
    id?:string,
    avgRating?:number,
    createdAt?:Date
}