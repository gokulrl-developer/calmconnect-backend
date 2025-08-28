import { UserForgotPasswordDTO } from "../../domain/dtos/user.dto";

export default interface IForgotPasswordUserUseCase{
    execute(dto:UserForgotPasswordDTO):Promise<void>
}