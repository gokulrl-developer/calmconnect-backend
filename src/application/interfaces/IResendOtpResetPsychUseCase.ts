import { PsychResendOtpDTO } from "../../domain/dtos/psych.dto";

export interface IResendOtpResetPsychUseCase {
  execute(dto: PsychResendOtpDTO): Promise<void>;
}