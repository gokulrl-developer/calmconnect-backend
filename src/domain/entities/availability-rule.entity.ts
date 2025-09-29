export default class AvailabilityRule{
    constructor(
   public psychologist:string,
   public startTime:string,
   public endTime:string,
   public startDate:Date,
   public endDate:Date,
   public durationInMins:number,
   public bufferTimeInMins:number,
   public quickSlots:string[],
   public slotsOpenTime:Date,
   public specialDays:SpecialDay[],
   public quickSlotsReleaseWindowMins?:number,
   public id?:string
    ){}
}

export interface SpecialDay{
    weekDay:number,
    availableSlots:string[]
}