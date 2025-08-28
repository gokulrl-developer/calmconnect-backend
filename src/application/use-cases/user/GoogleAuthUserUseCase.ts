import { UserGoogleAuthDTO } from "../../../domain/dtos/user.dto";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { LoginResponse } from "../../interfaces/ILoginUserUseCase";
import {  toLoginResponse, toUserDomainGoogleAuth } from "../../mappers/UserMapper";
import { generateAccessToken, generateRefreshToken } from "../../../utils/tokenHandler";
import  {IGoogleAuthUserUseCase}  from "../../interfaces/IGoogleAuthUserUseCase";
import { getGoogleAuthCredentials } from "../../../infrastructure/external/GoogleOauthService";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { ROLES } from "../../constants/roles.constants";




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
    
    const accessToken = generateAccessToken({id:User.id!,role:ROLES.USER});
    const refreshToken =generateRefreshToken({id:User.id!,role:ROLES.USER});  
    
    const result =toLoginResponse(User,accessToken,refreshToken)
    return result;
  }
}
