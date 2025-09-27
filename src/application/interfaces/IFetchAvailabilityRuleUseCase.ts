import { AvailabilityRuleDetailsDTO } from "../../domain/dtos/psych.dto";
import AvailabilityRule from "../../domain/entities/availability-rule.entity";

export default interface IFetchAvailabilityRuleUseCase{
    execute(dto:AvailabilityRuleDetailsDTO):Promise<AvailabilityRule>
}