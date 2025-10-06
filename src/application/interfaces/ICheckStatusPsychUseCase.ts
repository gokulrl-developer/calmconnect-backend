import { PsychCheckStatusDTO } from "../dtos/psych.dto";


export default interface ICheckStatusPsychUseCase{
    execute(dto:PsychCheckStatusDTO):Promise<{isVerified:boolean}>
}