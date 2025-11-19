import { UserResetPasswordDTO } from "../dtos/user.dto.js";


export default interface IResetPasswordUserUseCase{
    execute(dto:UserResetPasswordDTO):Promise<void>
}