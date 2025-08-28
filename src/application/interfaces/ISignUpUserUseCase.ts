import { UserSignUpDTO } from "../../domain/dtos/user.dto";

 export interface ISignUpUserUseCase {
  execute(dto: UserSignUpDTO): Promise<void>;
}
