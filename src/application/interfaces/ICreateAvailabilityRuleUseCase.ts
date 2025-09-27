import { CreateAvaialabilityRuleDTO } from "../../domain/dtos/psych.dto";

export default interface ICreateAvailabilityRuleUseCase{
    execute(dto:CreateAvaialabilityRuleDTO):Promise<void>
}