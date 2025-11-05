import { CreateComplaintDTO } from "../dtos/user.dto";

export default interface ICreateComplaintUseCase{
    execute(dto:CreateComplaintDTO):Promise<void>
}