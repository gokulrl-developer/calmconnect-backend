import { CancelSessionDTO } from "../dtos/psych.dto";

export default interface ICancelSessionPsychUseCase{
    execute(dto:CancelSessionDTO):Promise<void>
}