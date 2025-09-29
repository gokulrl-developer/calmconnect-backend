export default class Session{
    constructor(
       public psychologist:string,
       public user:string,
       public startTime:string,
       public durationInMins:number,
       public transactionIds:string[],
       public status:"scheduled"|"completed"|"cancelled",
       public fees:number, //rupees
       public id?:string,
       public videoRoomId?:string,
       public progressNotesId?:string,
    ){}
}
