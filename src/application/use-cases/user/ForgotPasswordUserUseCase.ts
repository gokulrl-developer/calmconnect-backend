import { UserForgotPasswordDTO } from "../../dtos/user.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { sendMail } from "../../../utils/nodemailHelper.js";
import generateOtp from "../../../utils/OtpGenerator.js";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IForgotPasswordUserUseCase from "../../interfaces/IForgotPasswordUserUseCase.js";

export default class ForgotPasswordUserUseCase implements IForgotPasswordUserUseCase{
    constructor(
      private readonly _otpRepository:IOtpRepository,
      private readonly _userRepository:IUserRepository
    ){}
    async execute(dto:UserForgotPasswordDTO){
       const user=await this._userRepository.findByEmail(dto.email);
       if(!user){
        throw new AppError(ERROR_MESSAGES.INVALID_EMAIL_PASSWORD,AppErrorCodes.INVALID_CREDENTIALS)
    } 
    if(user.isGoogleUser===true){
          throw new AppError(ERROR_MESSAGES.GOOGLE_AUTH_EMAIL,AppErrorCodes.INVALID_CREDENTIALS)
       }
       const otp=generateOtp()
       await this._otpRepository.storeOtp(dto.email,{otp,role:"user"})
       await sendMail(
                   dto.email,
                    EMAIL_MESSAGES.OTP_SUBJECT,
                    EMAIL_MESSAGES.OTP_BODY(otp)                  
               )
    }
}