import { PsychApplicationDTO } from "../dtos/psych.dto.js";

export default interface ICreateApplicationUseCase{
    execute(dto:PsychApplicationDTO):Promise<void>
}