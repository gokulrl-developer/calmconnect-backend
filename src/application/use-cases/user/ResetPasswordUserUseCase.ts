import { UserResetPasswordDTO } from "../../../domain/dtos/user.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { hashPassword } from "../../../utils/passwordEncryption";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IResetPasswordUserUseCase from "../../interfaces/IResetPasswordUserUseCase";

export default class ResetPasswordUserUseCase implements IResetPasswordUserUseCase{
   constructor(
   private readonly _userRepository:IUserRepository,
   private readonly _otpRepository:IOtpRepository
   ){}

    async execute(dto:UserResetPasswordDTO){
        const storedOtp=await this._otpRepository.getOtp(dto.email);
        if(!storedOtp || storedOtp.role !=="user"){
            throw new AppError(ERROR_MESSAGES.INVALID_OTP,AppErrorCodes.INVALID_OTP)
        }
        const user=await this._userRepository.findByEmail(dto.email);
        user!.password=await hashPassword(dto.password);
        await this._userRepository.update(user!.id!,user!)
    }
}