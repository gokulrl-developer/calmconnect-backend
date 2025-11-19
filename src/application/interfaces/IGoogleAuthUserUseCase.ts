import { UserGoogleAuthDTO } from "../dtos/user.dto.js";
import { LoginResponse } from "./ILoginUserUseCase.js";

export interface IGoogleAuthUserUseCase {
  execute(dto: UserGoogleAuthDTO): Promise<LoginResponse>;
}