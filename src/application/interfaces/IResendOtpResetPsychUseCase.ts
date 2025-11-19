import { PsychResendOtpDTO } from "../dtos/psych.dto.js";

export interface IResendOtpResetPsychUseCase {
  execute(dto: PsychResendOtpDTO): Promise<void>;
}