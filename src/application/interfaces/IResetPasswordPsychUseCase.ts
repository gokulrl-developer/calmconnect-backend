import { PsychResetPasswordDTO } from "../dtos/psych.dto.js";


export default interface IResetPasswordPsychUseCase{
    execute(dto:PsychResetPasswordDTO):Promise<void>
}