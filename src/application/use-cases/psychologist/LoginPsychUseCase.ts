import { PsychLoginDTO } from "../../../domain/dtos/psych.dto";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { comparePasswords } from "../../../utils/passwordEncryption";
import { generateAccessToken, generateRefreshToken } from "../../../utils/tokenHandler";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { ILoginPsychUseCase, LoginResponse } from "../../interfaces/ILoginPsychUseCase";
import { toLoginResponse } from "../../mappers/PsychMapper";




export default class LoginPsychUseCase implements ILoginPsychUseCase{
  constructor(
    private readonly _PsychRepository: IPsychRepository,
  ) {}

  async execute(dto: PsychLoginDTO):Promise<LoginResponse>{
    const { email, password } = dto;

    
    if (!email) {
      throw new AppError("Email is required",AppErrorCodes.INVALID_CREDENTIALS);
    }

    const psychEntity = await this._PsychRepository.findByEmail(dto.email);
    if (!psychEntity || !psychEntity.password) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS,AppErrorCodes.INVALID_CREDENTIALS);
    }
    if (psychEntity.isGooglePsych===true) {
      throw new AppError(ERROR_MESSAGES.GOOGLE_AUTH_EMAIL,AppErrorCodes.FORBIDDEN_ERROR);
    }
   

    const isPasswordValid = await comparePasswords(password,psychEntity.password);
    if (isPasswordValid===false) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS,AppErrorCodes.INVALID_CREDENTIALS);
    }
     
    if(psychEntity.isBlocked===true){
      throw new AppError(ERROR_MESSAGES.ACCOUNT_BLOCKED,AppErrorCodes.FORBIDDEN_ERROR)
    }
    
    const refreshToken = generateRefreshToken({ id: psychEntity.id!,role:"psychologist"});
    const accessToken = generateAccessToken({ id: psychEntity.id!,role:"psychologist" });

    return toLoginResponse(psychEntity,accessToken,refreshToken);
  }
}
