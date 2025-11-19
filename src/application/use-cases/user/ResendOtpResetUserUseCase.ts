import { UserResendOtpDTO } from "../../dtos/user.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import { sendMail } from "../../../utils/nodemailHelper.js";
import generateOtp from "../../../utils/OtpGenerator.js";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { ROLES } from "../../constants/roles.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { IResendOtpResetUserUseCase } from "../../interfaces/IResendOtpResetUserUseCase.js";

export default class ResendOtpResetUserUseCase implements IResendOtpResetUserUseCase {
  constructor(private readonly _otpRepository: IOtpRepository) {}

  async execute(dto: UserResendOtpDTO): Promise<void> {
    
      const storedOtp = await this._otpRepository.getOtp(dto.email);
      if (!storedOtp || storedOtp.role !== ROLES.USER) {
        throw new AppError(
          ERROR_MESSAGES.INVALID_OTP,
          AppErrorCodes.INVALID_OTP
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
