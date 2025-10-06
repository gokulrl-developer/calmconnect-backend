import { PsychSignUpDTO } from "../dtos/psych.dto";

export interface ISignUpPsychUseCase {
  execute(
    dto: PsychSignUpDTO
  ): Promise<void>;
}