import { UserResendOtpDTO } from "../../../domain/dtos/user.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { sendMail } from "../../../utils/nodemailHelper";
import generateOtp from "../../../utils/OtpGenerator";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { IResendOtpSignUpUserUseCase } from "../../interfaces/IResendOtpSignUpUserUseCase";



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
