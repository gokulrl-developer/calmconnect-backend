import IBaseRepository from "./IBaseRepository";
import SpecialDay from "../entities/special-day.entity";

export default interface ISpecialDayRepository extends IBaseRepository<SpecialDay>{
   findActiveByDatePsych(date:Date,psychId:string):Promise<SpecialDay | null>,
   findOverlappingActiveByTimeRangePsych(startTime:Date,endTime:Date,psychId:string):Promise<SpecialDay |null>
}