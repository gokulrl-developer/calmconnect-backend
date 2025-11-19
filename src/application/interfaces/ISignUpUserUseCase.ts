import { UserSignUpDTO } from "../dtos/user.dto.js";

 export interface ISignUpUserUseCase {
  execute(dto: UserSignUpDTO): Promise<void>;
}
