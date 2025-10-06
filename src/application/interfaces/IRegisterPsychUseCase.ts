import { PsychRegisterDTO } from "../dtos/psych.dto";

export interface IRegisterPsychUseCase {
  execute(dto: PsychRegisterDTO): Promise<void>;
}
