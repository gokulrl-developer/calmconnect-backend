import { ComplaintResolutionDTO } from "../dtos/admin.dto.js";

export default interface IComplaintResolutionUseCase{
    execute(dto:ComplaintResolutionDTO):Promise<void>
}