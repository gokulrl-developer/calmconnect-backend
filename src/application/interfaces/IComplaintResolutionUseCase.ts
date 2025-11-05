import { ComplaintResolutionDTO } from "../dtos/admin.dto";

export default interface IComplaintResolutionUseCase{
    execute(dto:ComplaintResolutionDTO):Promise<void>
}