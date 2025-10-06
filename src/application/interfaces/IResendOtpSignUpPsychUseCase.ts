import { PsychResendOtpDTO } from "../dtos/psych.dto";

export interface IResendOtpSignUpPsychUseCase {
  execute(dto: PsychResendOtpDTO): Promise<void>;
}