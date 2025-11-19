import { CreateComplaintDTO } from "../dtos/user.dto.js";

export default interface ICreateComplaintUseCase{
    execute(dto:CreateComplaintDTO):Promise<void>
}