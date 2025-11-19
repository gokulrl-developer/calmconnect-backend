import { CancelSessionDTO } from "../dtos/user.dto.js";

export default interface ICancelSessionUserUseCase{
    execute(dto:CancelSessionDTO):Promise<void>
}