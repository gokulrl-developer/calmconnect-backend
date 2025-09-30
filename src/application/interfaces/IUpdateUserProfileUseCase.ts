import { UpdateUserProfileDTO } from "../../domain/dtos/user.dto";

export default interface IUpdateUserProfileUseCase{
    execute(dto:UpdateUserProfileDTO):Promise<void>
}