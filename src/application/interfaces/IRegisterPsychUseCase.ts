import { PsychRegisterDTO } from "../dtos/psych.dto.js";

export interface IRegisterPsychUseCase {
  execute(dto: PsychRegisterDTO): Promise<void>;
}
