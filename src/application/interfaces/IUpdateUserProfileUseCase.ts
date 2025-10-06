import { UpdateUserProfileDTO } from "../dtos/user.dto";

export default interface IUpdateUserProfileUseCase{
    execute(dto:UpdateUserProfileDTO):Promise<void>
}