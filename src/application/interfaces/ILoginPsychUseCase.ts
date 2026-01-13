import { PsychLoginDTO } from "../dtos/psych.dto.js";

export interface LoginResponse {
  psych: {
    psychId: string;
    firstName: string;
    lastName: string;
    isVerified:boolean
  };
  accessToken: string;
  refreshToken: string;
}

export interface ILoginPsychUseCase {
  execute(dto: PsychLoginDTO): Promise<LoginResponse>;
}