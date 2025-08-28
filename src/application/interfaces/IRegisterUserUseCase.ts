import { UserRegisterDTO } from "../../domain/dtos/user.dto";

export interface IRegisterUserUseCase {
  execute(dto: UserRegisterDTO): Promise<void>;
}