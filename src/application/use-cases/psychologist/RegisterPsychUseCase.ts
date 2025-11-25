import { PsychRegisterDTO } from "../../dtos/psych.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { IRegisterPsychUseCase } from "../../interfaces/IRegisterPsychUseCase.js";
import { toPsychDomainRegister } from "../../mappers/PsychMapper.js";

export default class RegisterPsychUseCase implements IRegisterPsychUseCase {
    constructor(
        private _PsychRepository: IPsychRepository,
        private _otpRepository: IOtpRepository
    ){}
   async execute(dto: PsychRegisterDTO
   ){       
     const tempPsych = await this._otpRepository.verifyTempAccount(dto.email,dto.otp);
     if (!tempPsych) {
       throw new AppError(ERROR_MESSAGES.INVALID_OTP,AppErrorCodes.INVALID_CREDENTIALS);
      }

      const{otp:_otp,...psych}=tempPsych;
      const PsychEntity = toPsychDomainRegister(psych); 

      await this._PsychRepository.create(PsychEntity);
       await this._otpRepository.deleteTempAccount(dto.email)

}
}