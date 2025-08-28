import { PsychForgotPasswordDTO } from "../../../domain/dtos/psych.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { sendMail } from "../../../utils/nodemailHelper";
import generateOtp from "../../../utils/OtpGenerator";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { ROLES } from "../../constants/roles.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IForgotPasswordPsychUseCase from "../../interfaces/IForgotPasswordPsychUseCase";


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
       await this._otpRepository.storeOtp(dto.email,{otp,role:ROLES.PSYCHOLOGIST})
       await sendMail(
                   dto.email,
                    EMAIL_MESSAGES.OTP_SUBJECT,
                   EMAIL_MESSAGES.OTP_BODY(otp)
               )
    }
}