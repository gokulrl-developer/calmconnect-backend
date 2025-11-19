import { ComplaintListingByAdminDTO } from "../dtos/admin.dto.js";
import PaginationData from "../utils/calculatePagination.js";

export interface ComplaintListByAdminItem{
    complaintId:string,
    userFullName:string,
    userEmail:string,
    psychologistFullName:string,
    psychologistEmail:string,
    sessionId?:string,
    status:"pending"|"resolved",
    createdAt:string
}

export default interface IComplaintListingByAdminUseCase{
    execute(dto:ComplaintListingByAdminDTO):Promise<{complaints:ComplaintListByAdminItem[],paginationData:PaginationData}>
}