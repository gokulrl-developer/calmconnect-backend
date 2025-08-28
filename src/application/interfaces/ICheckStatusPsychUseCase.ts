import { PsychCheckStatusDTO } from "../../domain/dtos/psych.dto";


export default interface ICheckStatusPsychUseCase{
    execute(dto:PsychCheckStatusDTO):Promise<{isVerified:boolean}>
}