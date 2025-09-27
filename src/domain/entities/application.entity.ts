
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

