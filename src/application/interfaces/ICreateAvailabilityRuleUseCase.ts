import { CreateAvaialabilityRuleDTO } from "../dtos/psych.dto.js";

export default interface ICreateAvailabilityRuleUseCase{
    execute(dto:CreateAvaialabilityRuleDTO):Promise<void>
}