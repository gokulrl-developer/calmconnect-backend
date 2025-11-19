import { UserLoginDTO } from "../dtos/user.dto.js";

export interface LoginResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ILoginUserUseCase {
  execute(dto: UserLoginDTO): Promise<LoginResponse>;
}