import { DeleteAvailabilityRuleDTO } from "../../domain/dtos/psych.dto";

export default interface IDeleteAvailabilityRuleUseCase{
    execute(dto:DeleteAvailabilityRuleDTO):Promise<void>
}