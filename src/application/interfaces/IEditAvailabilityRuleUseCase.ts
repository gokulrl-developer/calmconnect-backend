import { EditAvaialabilityRuleDTO } from "../dtos/psych.dto.js";

export default interface IEditAvailabilityRuleUseCase{
    execute(dto:EditAvaialabilityRuleDTO):Promise<void>
}