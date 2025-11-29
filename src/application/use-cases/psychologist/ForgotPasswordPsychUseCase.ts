import { PsychForgotPasswordDTO } from "../../dtos/psych.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { sendMail } from "../../../utils/nodemailHelper.js";
import generateOtp from "../../../utils/OtpGenerator.js";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IForgotPasswordPsychUseCase from "../../interfaces/IForgotPasswordPsychUseCase.js";
import { Role } from "../../../domain/enums/Role.js";


export default class ForgotPasswordPsychUseCase implements IForgotPasswordPsychUseCase{
    constructor(
      private readonly _otpRepository:IOtpRepository,
      private readonly _psychRepository:IPsychRepository
    ){}
    async execute(dto:PsychForgotPasswordDTO){
       const user=await this._psychRepository.findByEmail(dto.email);
       if(!user){
        throw new AppError(ERROR_MESSAGES.INVALID_EMAIL_PASSWORD,AppErrorCodes.INVALID_CREDENTIALS)
    } 
    if(user.isGooglePsych===true){
          throw new AppError(ERROR_MESSAGES.GOOGLE_AUTH_EMAIL,AppErrorCodes.INVALID_CREDENTIALS)
       }
       const otp=generateOtp()
       await this._otpRepository.storeOtp(dto.email,{otp,role:Role.PSYCHOLOGIST})
       await sendMail(
                   dto.email,
                    EMAIL_MESSAGES.OTP_SUBJECT,
                   EMAIL_MESSAGES.OTP_BODY(otp)
               )
    }
}