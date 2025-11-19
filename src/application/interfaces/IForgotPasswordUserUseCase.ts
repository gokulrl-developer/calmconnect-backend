import { UserForgotPasswordDTO } from "../dtos/user.dto.js";

export default interface IForgotPasswordUserUseCase{
    execute(dto:UserForgotPasswordDTO):Promise<void>
}