import AvailabilityRule from "../entities/availability-rule.entity";
import IBaseRepository from "./IBaseRepository";

export default interface IAvailabilityRuleRepository extends IBaseRepository<AvailabilityRule>{
  findAllByPsychId(psychId:string):Promise<AvailabilityRule[]>,
  findByTimePeriod(fromDate:Date,toDate:Date):Promise<AvailabilityRule[]>,   //finding the availability rules overlapping to a time period
  findByDate(date:Date):Promise<AvailabilityRule |null>
}