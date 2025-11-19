import { PsychForgotPasswordDTO } from "../dtos/psych.dto.js";

export default interface IForgotPasswordPsychUseCase{
    execute(dto:PsychForgotPasswordDTO):Promise<void>
}