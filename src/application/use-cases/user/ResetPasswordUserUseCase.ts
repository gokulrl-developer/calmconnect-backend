import { UserResetPasswordDTO } from "../../dtos/user.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { hashPassword } from "../../../utils/passwordEncryption.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IResetPasswordUserUseCase from "../../interfaces/IResetPasswordUserUseCase.js";
import { Role } from "../../../domain/enums/Role.js";

export default class ResetPasswordUserUseCase implements IResetPasswordUserUseCase{
   constructor(
   private readonly _userRepository:IUserRepository,
   private readonly _otpRepository:IOtpRepository
   ){}

    async execute(dto:UserResetPasswordDTO){
        const storedOtp=await this._otpRepository.getOtp(dto.email);
        if(!storedOtp || storedOtp.role !==Role.USER){
            throw new AppError(ERROR_MESSAGES.INVALID_OTP,AppErrorCodes.INVALID_OTP)
        }
        const user=await this._userRepository.findByEmail(dto.email);
        user!.password=await hashPassword(dto.password);
        await this._userRepository.update(user!.id!,user!)
    }
}