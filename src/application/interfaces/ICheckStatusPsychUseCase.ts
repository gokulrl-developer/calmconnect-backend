import { PsychCheckStatusDTO } from "../dtos/psych.dto.js";


export default interface ICheckStatusPsychUseCase{
    execute(dto:PsychCheckStatusDTO):Promise<{isVerified:boolean}>
}