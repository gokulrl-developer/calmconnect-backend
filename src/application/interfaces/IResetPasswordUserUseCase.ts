import { UserResetPasswordDTO } from "../dtos/user.dto";


export default interface IResetPasswordUserUseCase{
    execute(dto:UserResetPasswordDTO):Promise<void>
}