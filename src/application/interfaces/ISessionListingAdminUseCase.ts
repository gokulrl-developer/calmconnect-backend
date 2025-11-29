import { SessionStatus } from "../../domain/enums/SessionStatus.js";
import { SessionListingDTO } from "../dtos/admin.dto.js";
import PaginationData from "../utils/calculatePagination.js";

export interface SessionListingAdminItem {
  userFullName: string;
  psychFullName: string;
  userEmail:string,
  psychEmail:string,
  startTime: Date;
  endTime:Date;
  durationInMins: number;
  status: SessionStatus;
  fees: number;
  sessionId: string;
}
export default interface ISessionListingAdminUseCase {
  execute(dto: SessionListingDTO): Promise<{sessions:SessionListingAdminItem[],paginationData:PaginationData}>;
}
