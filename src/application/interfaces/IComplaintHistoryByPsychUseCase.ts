import { ComplainthIstoryDTO } from "../dtos/admin.dto"
import PaginationData from "../utils/calculatePagination"

export interface ComplaintHistoryByAdminItem{
    complaintId:string,
    userFullName:string,
    userEmail:string,
    psychologistFullName:string,
    psychologistEmail:string,
    sessionId?:string,
    status:"pending"|"resolved",
    createdAt:string
}

export interface ComplaintHistoryResponse{
    complaints:ComplaintHistoryByAdminItem[],
    paginationData:PaginationData
}
export default interface IComplaintHistoryByPsychUseCase{
    execute(dto:ComplainthIstoryDTO):Promise<ComplaintHistoryResponse>
}