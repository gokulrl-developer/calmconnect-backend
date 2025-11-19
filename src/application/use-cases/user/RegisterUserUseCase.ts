import { UserRegisterDTO } from "../../dtos/user.dto.js";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { IRegisterUserUseCase } from "../../interfaces/IRegisterUserUseCase.js";
import { toUserDomainRegister } from "../../mappers/UserMapper.js";

export default class RegisterUserUseCase implements IRegisterUserUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository,
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