import { DeleteAvailabilityRuleDTO } from "../dtos/psych.dto.js";

export default interface IDeleteAvailabilityRuleUseCase{
    execute(dto:DeleteAvailabilityRuleDTO):Promise<void>
}