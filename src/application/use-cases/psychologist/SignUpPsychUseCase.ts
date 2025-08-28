import { PsychSignUpDTO } from "../../../domain/dtos/psych.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import generateOtp from "../../../utils/OtpGenerator";
import { hashPassword } from "../../../utils/passwordEncryption";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { sendMail } from "../../../utils/nodemailHelper";
import { ISignUpPsychUseCase } from "../../interfaces/ISignUpPsychUseCase";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants";



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
        const result=await sendMail(
            email,
            EMAIL_MESSAGES.OTP_SUBJECT,
            EMAIL_MESSAGES.OTP_BODY(otp)
        )
   }
}