
export default class User {
  constructor(
    public firstName:string,
    public lastName:string,
    public email:string,
    public isBlocked:boolean,
    public walletBalance:number,
    public password?:string,
    public id?:string,
    public createdAt?:Date,
    public gender?:"male"|"female"|"others",
    public dob?:Date,
    public profilePicture?:string,
    public address?:string,
    public isGoogleUser?:boolean,
    public googleId?:string
    
  ) {}

}

export interface UserRawDatabase{
    firstName:string,
    lastName:string,
    email:string,
    id:string,
    password?:string,
    isBlocked:boolean,
    walletBalance:number,
    createdAt?:Date,
    gender?:"male"|"female"|"others",
    dob?:Date,
    profilePicture?:string,
    address?:string,
    isGoogleUser?:boolean,
    googleId?:string
}

