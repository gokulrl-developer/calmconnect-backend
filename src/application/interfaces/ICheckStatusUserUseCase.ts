import { UserCheckStatusDTO } from "../dtos/user.dto.js";


export default interface ICheckStatusUserUseCase{
    execute(dto:UserCheckStatusDTO):Promise<void>
}