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
   public specialDays:specialDay[],
   public quickSlotsReleaseWindowMins?:number,
   public id?:string
    ){}
}

interface specialDay{
    weekDay:number,
    availableSlots:string[]
}