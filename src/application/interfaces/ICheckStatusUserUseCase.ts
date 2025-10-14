import { UserCheckStatusDTO } from "../dtos/user.dto";


export default interface ICheckStatusUserUseCase{
    execute(dto:UserCheckStatusDTO):Promise<void>
}