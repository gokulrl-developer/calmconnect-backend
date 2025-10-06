import { UserSignUpDTO } from "../dtos/user.dto";

 export interface ISignUpUserUseCase {
  execute(dto: UserSignUpDTO): Promise<void>;
}
