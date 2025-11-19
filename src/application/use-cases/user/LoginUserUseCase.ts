import { UserLoginDTO } from "../../dtos/user.dto.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { comparePasswords } from "../../../utils/passwordEncryption.js";
import { generateAccessToken, generateRefreshToken } from "../../../utils/tokenHandler.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { ROLES } from "../../constants/roles.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { ILoginUserUseCase, LoginResponse } from "../../interfaces/ILoginUserUseCase.js";
import { toLoginResponse } from "../../mappers/UserMapper.js";

export default class LoginUserUseCase implements ILoginUserUseCase{
  constructor(
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(dto: UserLoginDTO):Promise<LoginResponse>{
    const { email, password } = dto;

  
    const userEntity = await this._userRepository.findByEmail(dto.email);
    if (!userEntity ) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS,AppErrorCodes.INVALID_CREDENTIALS);
    }
    if (userEntity.isGoogleUser===true) {
      throw new AppError(ERROR_MESSAGES.GOOGLE_AUTH_EMAIL,AppErrorCodes.INVALID_AUTH);
    }
    
    const isPasswordValid = await comparePasswords(password,userEntity.password!);
    if (isPasswordValid===false) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS,AppErrorCodes.INVALID_CREDENTIALS);
    }
    
    if(userEntity.isBlocked===true){
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED,AppErrorCodes.BLOCKED)
    }

    const refreshToken = generateRefreshToken({ id: userEntity.id!,role:ROLES.USER });
    const accessToken = generateAccessToken({ id: userEntity.id!,role:ROLES.USER });

    return toLoginResponse(userEntity,accessToken,refreshToken);
  }
}
