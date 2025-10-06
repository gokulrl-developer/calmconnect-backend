import { UpdatePsychProfileDTO } from "../dtos/psych.dto";

export default interface IUpdatePsychProfileUseCase{
    execute(dto:UpdatePsychProfileDTO):Promise<void>
}