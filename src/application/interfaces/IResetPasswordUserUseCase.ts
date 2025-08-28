import { UserResetPasswordDTO } from "../../domain/dtos/user.dto";


export default interface IResetPasswordUserUseCase{
    execute(dto:UserResetPasswordDTO):Promise<void>
}