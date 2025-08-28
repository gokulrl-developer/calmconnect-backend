import { PsychRegisterDTO } from "../../domain/dtos/psych.dto";

export interface IRegisterPsychUseCase {
  execute(dto: PsychRegisterDTO): Promise<void>;
}
