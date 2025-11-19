import { UserResendOtpDTO } from "../../dtos/user.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import { sendMail } from "../../../utils/nodemailHelper.js";
import generateOtp from "../../../utils/OtpGenerator.js";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { IResendOtpSignUpUserUseCase } from "../../interfaces/IResendOtpSignUpUserUseCase.js";

export default class ResendOtpSignUpUserUseCase implements IResendOtpSignUpUserUseCase{
  constructor(
    private readonly _otpRepository: IOtpRepository,
  ) {}

  async execute(dto: UserResendOtpDTO): Promise<void> {
  
    const tempUser=await this._otpRepository.getTempAccount(dto.email)
   if(!tempUser){
    throw new AppError(ERROR_MESSAGES.INVALID_OTP,AppErrorCodes.INVALID_OTP)
   }
     const newOtp=generateOtp();
     tempUser.otp=newOtp;
    await this._otpRepository.deleteTempAccount(dto.email);
    await this._otpRepository.storeTempAccount(dto.email,tempUser)

    await sendMail(
            dto.email,
            EMAIL_MESSAGES.OTP_SUBJECT,
            EMAIL_MESSAGES.OTP_BODY(newOtp)
    )
}
}
