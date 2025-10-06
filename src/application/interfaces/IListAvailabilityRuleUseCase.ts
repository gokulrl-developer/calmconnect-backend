import { ListAvailabilityRulesDTO } from "../dtos/psych.dto";

export interface AvailabilityRuleSummary{
    availabilityRuleId:string,
    startDate:string,
    endDate:string
}

export default interface IListAvailabilityRuleUseCase{
    execute(dto:ListAvailabilityRulesDTO):Promise<AvailabilityRuleSummary[]>
}