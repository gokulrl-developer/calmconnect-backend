export default class Complaint{
    constructor(
        public user:string,
        public psychologist:string,
        public session:string,
        public description:string,
        public status:"resolved"|"pending"="pending",
        public createdAt:Date=new Date(),
        public adminNotes:string,
        public id?:string,
        public resolvedAt?:Date
    ){}
}