import IBaseRepository from "./IBaseRepository.js";
import SpecialDay from "../entities/special-day.entity.js";

export default interface ISpecialDayRepository extends IBaseRepository<SpecialDay>{
   findActiveByDatePsych(date:Date,psychId:string):Promise<SpecialDay | null>,
   findOverlappingActiveByTimeRangePsych(startTime:Date,endTime:Date,psychId:string):Promise<SpecialDay |null>
}