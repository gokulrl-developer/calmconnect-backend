import { PsychResendOtpDTO } from "../../domain/dtos/psych.dto";

export interface IResendOtpSignUpPsychUseCase {
  execute(dto: PsychResendOtpDTO): Promise<void>;
}