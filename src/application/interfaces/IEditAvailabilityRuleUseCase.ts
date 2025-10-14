import { EditAvaialabilityRuleDTO } from "../dtos/psych.dto";

export default interface IEditAvailabilityRuleUseCase{
    execute(dto:EditAvaialabilityRuleDTO):Promise<void>
}