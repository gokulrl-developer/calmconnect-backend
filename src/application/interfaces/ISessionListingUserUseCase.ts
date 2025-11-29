import { SessionStatus } from "../../domain/enums/SessionStatus.js";
import { SessionListingDTO } from "../dtos/user.dto.js";
import PaginationData from "../utils/calculatePagination.js";

export interface SessionListingUserItem {
  psychFullName: string;
  psychEmail:string;
  startTime: Date;
  endTime: Date;
  durationInMins: number;
  status: SessionStatus;
  fees: number;
  sessionId: string;
}
export default interface ISessionListingUserUseCase {
  execute(dto: SessionListingDTO): Promise<{sessions:SessionListingUserItem[],paginationData:PaginationData}>;
}
