import { PsychResetPasswordDTO } from "../../dtos/psych.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { hashPassword } from "../../../utils/passwordEncryption.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { ROLES } from "../../constants/roles.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IResetPasswordPsychUseCase from "../../interfaces/IResetPasswordPsychUseCase.js";

export default class ResetPasswordPsychUseCase implements IResetPasswordPsychUseCase{
   constructor(
   private readonly _psychRepository:IPsychRepository,
   private readonly _otpRepository:IOtpRepository
   ){}

    async execute(dto:PsychResetPasswordDTO){
        const storedOtp=await this._otpRepository.getOtp(dto.email);
        if(!storedOtp || storedOtp.role !==ROLES.PSYCHOLOGIST){
            throw new AppError(ERROR_MESSAGES.INVALID_OTP,AppErrorCodes.INVALID_OTP)
        }
        const user=await this._psychRepository.findByEmail(dto.email);
        user!.password=await hashPassword(dto.password);
        await this._psychRepository.update(user!.id!,user!)
    }
}