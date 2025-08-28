import { PsychApplicationDTO } from "../../domain/dtos/psych.dto";

export default interface ICreateApplicationUseCase{
    execute(dto:PsychApplicationDTO):Promise<void>
}