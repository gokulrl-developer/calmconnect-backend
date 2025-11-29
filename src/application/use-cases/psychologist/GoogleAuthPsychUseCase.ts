import { PsychGoogleAuthDTO } from "../../dtos/psych.dto.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { LoginResponse } from "../../interfaces/ILoginPsychUseCase.js";
import { toGoogleAuthResponse, toPsychDomainSocialAuth } from "../../mappers/PsychMapper.js";
import { generateAccessToken, generateRefreshToken } from "../../../utils/tokenHandler.js";
import { IGoogleAuthPsychUseCase } from "../../interfaces/IGoogleAuthPsychUseCase.js";
import { getGoogleAuthCredentials } from "../../../infrastructure/external/GoogleOauthService.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { Role } from "../../../domain/enums/Role.js";

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
    const accessToken = generateAccessToken({id:psych.id!,role:Role.PSYCHOLOGIST});
    const refreshToken =generateRefreshToken({id:psych.id!,role:Role.PSYCHOLOGIST});  
    const result =toGoogleAuthResponse(psych,accessToken,refreshToken)
    return result;
  }
}
