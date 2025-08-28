import { PsychSignUpDTO } from "../../domain/dtos/psych.dto";

export interface ISignUpPsychUseCase {
  execute(
    dto: PsychSignUpDTO
  ): Promise<void>;
}