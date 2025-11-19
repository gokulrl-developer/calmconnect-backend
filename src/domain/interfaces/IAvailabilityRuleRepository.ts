import AvailabilityRule from "../entities/availability-rule.entity.js";
import IBaseRepository from "./IBaseRepository.js";

export default interface IAvailabilityRuleRepository extends IBaseRepository<AvailabilityRule>{
  findActiveByWeekDayPsych(weekDay:number,psychId:string):Promise<AvailabilityRule[]>,
  findAllActiveByPsychId(psychId:string):Promise<AvailabilityRule[]>,
}