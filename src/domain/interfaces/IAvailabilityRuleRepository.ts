import AvailabilityRule from "../entities/availability-rule.entity";
import IBaseRepository from "./IBaseRepository";

export default interface IAvailabilityRuleRepository extends IBaseRepository<AvailabilityRule>{
  findAllByPsychId(psychId:string):Promise<AvailabilityRule[]>,
  findByPsychTimePeriod(fromDate:Date,toDate:Date,psychId:string):Promise<AvailabilityRule[]>,   //finding the availability rules overlapping to a time period
  findByDatePsych(date:Date,psychId:string):Promise<AvailabilityRule |null>
}