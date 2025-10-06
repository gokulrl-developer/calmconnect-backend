import { UserGoogleAuthDTO } from "../dtos/user.dto";
import { LoginResponse } from "./ILoginUserUseCase";

export interface IGoogleAuthUserUseCase {
  execute(dto: UserGoogleAuthDTO): Promise<LoginResponse>;
}