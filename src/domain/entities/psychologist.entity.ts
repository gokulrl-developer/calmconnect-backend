
export default class Psychologist {
  constructor(
    public firstName:string,
    public lastName:string,
    public email:string,
    public isVerified:boolean,
    public isBlocked:boolean,
    public walletBalance:number,
    public id?:string,
    public password?:string,
    public gender?:"male"|"female"|"others",
    public dob?:Date,
    public profilePicture?:string,
    public address?:string,
    public languages?:string,
    public specializations?:string[],
    public bio?:string,
    public avgRating?:number,
    public hourlyFees?:number,
    public quickSlotHourlyFees?:number,
    public applications?:string[],
    public licenseUrl?:string,
    public qualifications?:string,
    public createdAt?:Date, 
    public isGooglePsych?:boolean,
    public googleId?:string  
  ) {}

}

