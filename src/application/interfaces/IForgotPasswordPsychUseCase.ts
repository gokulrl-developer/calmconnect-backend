import { PsychForgotPasswordDTO } from "../dtos/psych.dto";

export default interface IForgotPasswordPsychUseCase{
    execute(dto:PsychForgotPasswordDTO):Promise<void>
}