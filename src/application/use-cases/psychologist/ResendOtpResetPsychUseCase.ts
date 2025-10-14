import { PsychResendOtpDTO } from "../../dtos/psych.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { sendMail } from "../../../utils/nodemailHelper";
import generateOtp from "../../../utils/OtpGenerator";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { ROLES } from "../../constants/roles.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { IResendOtpResetPsychUseCase } from "../../interfaces/IResendOtpResetPsychUseCase";

export default class ResendOtpResetPsychUseCase implements IResendOtpResetPsychUseCase {
  constructor(private readonly _otpRepository: IOtpRepository) {}

  async execute(dto: PsychResendOtpDTO): Promise<void> {
    
      const storedOtp = await this._otpRepository.getOtp(dto.email);
      if (!storedOtp || storedOtp.role !== ROLES.PSYCHOLOGIST) {
        throw new AppError(
          ERROR_MESSAGES.INVALID_OTP,
          AppErrorCodes.SESSION_EXPIRED
        );
      }
    
    const newOtp = generateOtp();
    storedOtp.otp = newOtp;
    await this._otpRepository.deleteOtp(dto.email);
    await this._otpRepository.storeOtp(dto.email, storedOtp);

    await sendMail(
      dto.email,
      EMAIL_MESSAGES.OTP_SUBJECT,
      EMAIL_MESSAGES.OTP_BODY(newOtp)
    );
  }
}
