import { ListAvailabilityRulesDTO } from "../dtos/psych.dto";

export interface AvailabilityRuleSummary{
 weekDay:number,   // 0-6 0-sunday,6-saturday
 availabilityRuleId:string
}

export default interface IListAvailabilityRulesUseCase{
    execute(dto:ListAvailabilityRulesDTO):Promise<AvailabilityRuleSummary[]>
}