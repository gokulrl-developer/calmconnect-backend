import { CancelSessionDTO } from "../dtos/user.dto";

export default interface ICancelSessionUserUseCase{
    execute(dto:CancelSessionDTO):Promise<void>
}