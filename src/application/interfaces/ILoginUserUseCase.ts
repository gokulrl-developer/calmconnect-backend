import { UserLoginDTO } from "../../domain/dtos/user.dto";

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