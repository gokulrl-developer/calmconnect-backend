import { UserGoogleAuthDTO } from "../../dtos/user.dto.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { LoginResponse } from "../../interfaces/ILoginUserUseCase.js";
import { toLoginResponse, toUserDomainGoogleAuth } from "../../mappers/UserMapper.js";
import { generateAccessToken, generateRefreshToken } from "../../../utils/tokenHandler.js";
import { IGoogleAuthUserUseCase } from "../../interfaces/IGoogleAuthUserUseCase.js";
import { getGoogleAuthCredentials } from "../../../infrastructure/external/GoogleOauthService.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { Role } from "../../../domain/enums/Role.js";

export default class GoogleAuthUserUseCase implements IGoogleAuthUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(dto:UserGoogleAuthDTO): Promise<LoginResponse> {
    const {code}=dto;
    const googleUser = await getGoogleAuthCredentials(code);

    let User = await this._userRepository.findByEmail(googleUser.email);
    if(User && User.isGoogleUser===false){
     throw new AppError(ERROR_MESSAGES.CREDENTIALS_BASED_AUTH,AppErrorCodes.FORBIDDEN_ERROR)
    }
    if (!User) {
      const UserEntity=await toUserDomainGoogleAuth(googleUser);
      const res = await this._userRepository.create(UserEntity);
      User=res;
    }
    
    const accessToken = generateAccessToken({id:User.id!,role:Role.USER});
    const refreshToken =generateRefreshToken({id:User.id!,role:Role.USER});  
    
    const result =toLoginResponse(User,accessToken,refreshToken)
    return result;
  }
}
