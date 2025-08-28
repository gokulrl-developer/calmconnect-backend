import { UserSignUpDTO } from "../../../domain/dtos/user.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import generateOtp from "../../../utils/OtpGenerator";
import { hashPassword } from "../../../utils/passwordEncryption";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { sendMail } from "../../../utils/nodemailHelper";
import { ISignUpUserUseCase } from "../../interfaces/ISignUpUserUseCase";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { EMAIL_MESSAGES } from "../../constants/email-messages.constants";



export default class SignUpUserUseCase implements ISignUpUserUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepostitory: IOtpRepository,
    ){}
   async execute(dto: UserSignUpDTO
   ){
        const {email} = dto;
     
        const userAlreadyExists = await this._userRepository.findByEmail(email);
        if (userAlreadyExists) {
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