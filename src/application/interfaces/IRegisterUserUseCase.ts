import { UserRegisterDTO } from "../dtos/user.dto";

export interface IRegisterUserUseCase {
  execute(dto: UserRegisterDTO): Promise<void>;
}