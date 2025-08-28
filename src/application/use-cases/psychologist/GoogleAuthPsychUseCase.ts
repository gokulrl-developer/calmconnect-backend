import { PsychGoogleAuthDTO } from "../../../domain/dtos/psych.dto";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { LoginResponse } from "../../interfaces/ILoginPsychUseCase";
import { toGoogleAuthResponse, toPsychDomainSocialAuth } from "../../mappers/PsychMapper";
import { generateAccessToken, generateRefreshToken } from "../../../utils/tokenHandler";
import { IGoogleAuthPsychUseCase } from "../../interfaces/IGoogleAuthPsychUseCase";
import { getGoogleAuthCredentials } from "../../../infrastructure/external/GoogleOauthService";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";




export default class GoogleAuthPsychUseCase implements IGoogleAuthPsychUseCase {
  constructor(
    private readonly _psychologistRepository: IPsychRepository,
  ) {}

  async execute(dto:PsychGoogleAuthDTO): Promise<LoginResponse> {
    const {code}=dto;
    const googlePsych = await getGoogleAuthCredentials(code);
    let psych = await this._psychologistRepository.findByEmail(googlePsych.email);
    if(psych && psych.isGooglePsych===false){
     throw new AppError(ERROR_MESSAGES.CREDENTIALS_BASED_AUTH,AppErrorCodes.FORBIDDEN_ERROR)
    }
    if (!psych) {
      const psychEntity=await toPsychDomainSocialAuth(googlePsych);
      const res = await this._psychologistRepository.create(psychEntity);
      psych=res;
    }
    
    const accessToken = generateAccessToken({id:psych.id!,role:"psychologist"});
    const refreshToken =generateRefreshToken({id:psych.id!,role:"psychologist"});  
    const result =toGoogleAuthResponse(psych,accessToken,refreshToken)
    return result;
  }
}
