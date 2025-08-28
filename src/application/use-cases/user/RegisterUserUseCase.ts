import { UserRegisterDTO } from "../../../domain/dtos/user.dto";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { IRegisterUserUseCase } from "../../interfaces/IRegisterUserUseCase";
import { toUserDomainRegister } from "../../mappers/UserMapper";




export default class RegisterUserUseCase implements IRegisterUserUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository
    ){}
   async execute(dto: UserRegisterDTO
   ){       
     const tempUser = await this._otpRepository.verifyTempAccount(dto.email,dto.otp);
     if (!tempUser) {
       throw new AppError(ERROR_MESSAGES.INVALID_OTP,AppErrorCodes.INVALID_OTP);
      }

      const{otp,...user}=tempUser;
      const userEntity = toUserDomainRegister(user); 

      await this._userRepository.create(userEntity);
      await this._otpRepository.deleteTempAccount(dto.email)
}
}