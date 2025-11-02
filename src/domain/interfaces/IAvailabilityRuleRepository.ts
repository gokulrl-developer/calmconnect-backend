import AvailabilityRule from "../entities/availability-rule.entity";
import IBaseRepository from "./IBaseRepository";

export default interface IAvailabilityRuleRepository extends IBaseRepository<AvailabilityRule>{
  findActiveByWeekDayPsych(weekDay:number,psychId:string):Promise<AvailabilityRule[]>,
  findAllActiveByPsychId(psychId:string):Promise<AvailabilityRule[]>,
}