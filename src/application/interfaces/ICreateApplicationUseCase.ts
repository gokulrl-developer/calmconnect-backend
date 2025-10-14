import { PsychApplicationDTO } from "../dtos/psych.dto";

export default interface ICreateApplicationUseCase{
    execute(dto:PsychApplicationDTO):Promise<void>
}