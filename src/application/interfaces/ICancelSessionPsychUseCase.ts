import { CancelSessionDTO } from "../dtos/psych.dto.js";

export default interface ICancelSessionPsychUseCase{
    execute(dto:CancelSessionDTO):Promise<void>
}