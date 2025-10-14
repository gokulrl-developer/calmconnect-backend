import QuickSlot from "../entities/quick-slot.entity";
import IBaseRepository from "./IBaseRepository";


export default interface IQuickSlotRepository extends IBaseRepository<QuickSlot>{
   findOverlappingActiveByTimeRangePsych(startTime:Date,endTime:Date,psychId:string):Promise<QuickSlot[]>,
   findActiveByWeekDayPsych(psychId:string,weekDay:number):Promise<QuickSlot[]>,
   findActiveByDatePsych(date:Date,psychId:string):Promise<QuickSlot[]>,
}