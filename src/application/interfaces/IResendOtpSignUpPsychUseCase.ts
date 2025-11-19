import { PsychResendOtpDTO } from "../dtos/psych.dto.js";

export interface IResendOtpSignUpPsychUseCase {
  execute(dto: PsychResendOtpDTO): Promise<void>;
}