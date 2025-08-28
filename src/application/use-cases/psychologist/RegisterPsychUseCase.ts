import { PsychRegisterDTO } from "../../../domain/dtos/psych.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { IRegisterPsychUseCase } from "../../interfaces/IRegisterPsychUseCase";
import { toPsychDomainRegister } from "../../mappers/PsychMapper";



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

      const{otp,...psych}=tempPsych;
      const PsychEntity = toPsychDomainRegister(psych); 

      await this._PsychRepository.create(PsychEntity);
       await this._otpRepository.deleteTempAccount(dto.email)

}
}