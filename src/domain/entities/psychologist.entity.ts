
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
    public languages?:string[],
    public specializations?:string[],
    public bio?:string,
    public avgRating?:number,
    public hourlyFees?:number,
    public applications?:string[],
    public licenseUrl?:string,
    public qualifications?:string[],
    public createdAt?:Date, 
    public isGooglePsych?:boolean,
    public googleId?:string  
  ) {}

}

export interface PsychRawDatabase{
    firstName:string,
    lastName:string,
    email:string,
    isVerified:boolean,
    id:string,
    password?:string,
    isBlocked:boolean,
    gender?:"male"|"female"|"others",
    dob?:Date,
    profilePicture?:string,
    address?:string,
    walletBalance:number,
    languages?:string[],
    specializations?:string[],
    bio?:string,
    avgRating?:number,
    hourlyFees?:number,
    applications?:string[],
    licenseUrl?:string,
    qualifications?:string[],
    createdAt?:Date,
    isGooglePsych?:boolean,
    googleId?:string
}
