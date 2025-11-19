import { UserRegisterDTO } from "../dtos/user.dto.js";

export interface IRegisterUserUseCase {
  execute(dto: UserRegisterDTO): Promise<void>;
}