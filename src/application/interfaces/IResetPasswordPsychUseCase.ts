import { PsychResetPasswordDTO } from "../../domain/dtos/psych.dto";


export default interface IResetPasswordPsychUseCase{
    execute(dto:PsychResetPasswordDTO):Promise<void>
}