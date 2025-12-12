import { SessionStatus } from "../enums/SessionStatus.js";

export default class Session{
    constructor(
       public psychologist:string,
       public user:string,
       public startTime:Date,
       public endTime:Date,
       public durationInMins:number,
       public transactionIds:string[],
       public status:SessionStatus,
       public fees:number, //rupees
       public id?:string,
       public videoRoomId?:string,
    ){}
}
