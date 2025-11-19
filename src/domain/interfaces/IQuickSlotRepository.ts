import QuickSlot from "../entities/quick-slot.entity.js";
import IBaseRepository from "./IBaseRepository.js";


export default interface IQuickSlotRepository extends IBaseRepository<QuickSlot>{
   findOverlappingActiveByTimeRangePsych(startTime:Date,endTime:Date,psychId:string):Promise<QuickSlot[]>,
   findActiveByWeekDayPsych(psychId:string,weekDay:number):Promise<QuickSlot[]>,
   findActiveByDatePsych(date:Date,psychId:string):Promise<QuickSlot[]>,
}