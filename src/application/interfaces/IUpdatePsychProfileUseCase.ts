import { UpdatePsychProfileDTO } from "../../domain/dtos/psych.dto";

export default interface IUpdatePsychProfileUseCase{
    execute(dto:UpdatePsychProfileDTO):Promise<void>
}