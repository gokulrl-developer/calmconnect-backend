export default class Holiday{
    constructor(
     public psychologist:string,
     public date:Date,
     public availableSlots:string[],
     public id?:string
    ){}
}