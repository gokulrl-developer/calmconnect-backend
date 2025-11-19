import { UpdateUserProfileDTO } from "../dtos/user.dto.js";

export default interface IUpdateUserProfileUseCase{
    execute(dto:UpdateUserProfileDTO):Promise<void>
}