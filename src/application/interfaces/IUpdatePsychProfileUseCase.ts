import { UpdatePsychProfileDTO } from "../dtos/psych.dto.js";

export default interface IUpdatePsychProfileUseCase{
    execute(dto:UpdatePsychProfileDTO):Promise<void>
}