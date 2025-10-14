import { PsychResetPasswordDTO } from "../dtos/psych.dto";


export default interface IResetPasswordPsychUseCase{
    execute(dto:PsychResetPasswordDTO):Promise<void>
}