import { PsychResendOtpDTO } from "../../../domain/dtos/psych.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { sendMail } from "../../../utils/nodemailHelper";
import generateOtp from "../../../utils/OtpGenerator";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { IResendOtpSignUpPsychUseCase } from "../../interfaces/IResendOtpSignUpPsychUseCase";

export default class ResendOtpSignUpPsychUseCase implements IResendOtpSignUpPsychUseCase {
  constructor(private readonly _otpRepository: IOtpRepository) {}

  async execute(dto: PsychResendOtpDTO): Promise<void> {
   
      const tempPsych = await this._otpRepository.getTempAccount(dto.email);
      if (!tempPsych) {
        throw new AppError(
          ERROR_MESSAGES.INVALID_OTP,
          AppErrorCodes.SESSION_EXPIRED
        );
      }

    const newOtp = generateOtp();
    tempPsych.otp = newOtp;
    await this._otpRepository.deleteTempAccount(dto.email);
    await this._otpRepository.storeTempAccount(dto.email, tempPsych);

    await sendMail(
      dto.email,
      EMAIL_MESSAGES.OTP_SUBJECT,
      EMAIL_MESSAGES.OTP_BODY(newOtp)
    );
  }
}
