import { PsychSignUpDTO } from "../dtos/psych.dto.js";

export interface ISignUpPsychUseCase {
  execute(
    dto: PsychSignUpDTO
  ): Promise<void>;
}