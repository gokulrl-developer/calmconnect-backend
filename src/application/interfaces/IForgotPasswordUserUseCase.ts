import { UserForgotPasswordDTO } from "../dtos/user.dto";

export default interface IForgotPasswordUserUseCase{
    execute(dto:UserForgotPasswordDTO):Promise<void>
}