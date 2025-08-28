import { PsychResetPasswordDTO } from "../../../domain/dtos/psych.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { hashPassword } from "../../../utils/passwordEncryption";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { ROLES } from "../../constants/roles.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IResetPasswordPsychUseCase from "../../interfaces/IResetPasswordPsychUseCase";

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