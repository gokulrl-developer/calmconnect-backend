import { SessionListingDTO } from "../dtos/admin.dto";
import PaginationData from "../utils/calculatePagination";

export interface SessionListingAdminItem {
  userFullName: string;
  psychFullName: string;
  userEmail:string,
  psychEmail:string,
  startTime: Date;
  endTime:Date;
  durationInMins: number;
  status: "scheduled"|"completed"|"cancelled"|"available"|"pending";
  fees: number;
  sessionId: string;
}
export default interface ISessionListingAdminUseCase {
  execute(dto: SessionListingDTO): Promise<{sessions:SessionListingAdminItem[],paginationData:PaginationData}>;
}
