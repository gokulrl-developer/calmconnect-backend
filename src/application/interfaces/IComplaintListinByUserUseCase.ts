import { ComplaintStatus } from "../../domain/enums/ComplaintStatus.js";
import { ListComplaintsDTO } from "../dtos/user.dto.js";
import PaginationData from "../utils/calculatePagination.js";

export interface ComplaintListByUserItem{
    complaintId:string;
    psychologistFullName:string,
    psychologistEmail:string,
    sessionId?:string,
    status:ComplaintStatus,
    createdAt:string
}
export default interface IComplaintListingByUserUseCase{
    execute(dto:ListComplaintsDTO):Promise<{complaints:ComplaintListByUserItem[],paginationData:PaginationData}>
}