import { PsychResendOtpDTO } from "../dtos/psych.dto";

export interface IResendOtpResetPsychUseCase {
  execute(dto: PsychResendOtpDTO): Promise<void>;
}