import { PsychForgotPasswordDTO } from "../../domain/dtos/psych.dto";

export default interface IForgotPasswordPsychUseCase{
    execute(dto:PsychForgotPasswordDTO):Promise<void>
}