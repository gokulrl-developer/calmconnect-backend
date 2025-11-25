import { PsychSignUpDTO } from "../../dtos/psych.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import generateOtp from "../../../utils/OtpGenerator.js";
import { hashPassword } from "../../../utils/passwordEncryption.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { sendMail } from "../../../utils/nodemailHelper.js";
import { ISignUpPsychUseCase } from "../../interfaces/ISignUpPsychUseCase.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants.js";

export default class SignUpPsychUseCase implements ISignUpPsychUseCase{
    constructor(
        private _psychRepository: IPsychRepository,
        private _otpRepostitory: IOtpRepository,
    ){}
   async execute(dto: PsychSignUpDTO
   ){
        const {email} = dto;
      
      if (!email) {
        throw new AppError("Email Required",AppErrorCodes.INVALID_CREDENTIALS);
      }

  
        const exists = await this._psychRepository.findByEmail(email);
        if (exists) {
         throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_USED,AppErrorCodes.EMAIL_ALREADY_USED);
        }
        
        const otp = generateOtp();

        dto.password= await hashPassword(dto.password)
     
        await this._otpRepostitory.storeTempAccount(email,{...dto,otp})
        await sendMail(
            email,
            EMAIL_MESSAGES.OTP_SUBJECT,
            EMAIL_MESSAGES.OTP_BODY(otp)
        )
   }
}