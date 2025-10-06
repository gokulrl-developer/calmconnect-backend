import { PsychLoginDTO } from "../dtos/psych.dto";

export interface LoginResponse {
  psych: {
    id: string;
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