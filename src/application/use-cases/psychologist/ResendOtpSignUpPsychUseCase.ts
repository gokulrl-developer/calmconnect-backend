import { PsychResendOtpDTO } from "../../dtos/psych.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import { sendMail } from "../../../utils/nodemailHelper.js";
import generateOtp from "../../../utils/OtpGenerator.js";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { IResendOtpSignUpPsychUseCase } from "../../interfaces/IResendOtpSignUpPsychUseCase.js";

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
