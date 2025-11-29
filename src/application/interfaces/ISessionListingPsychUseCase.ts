import { SessionStatus } from "../../domain/enums/SessionStatus.js";
import { SessionListingDTO } from "../dtos/psych.dto.js";
import PaginationData from "../utils/calculatePagination.js";

export interface SessionListingPsychItem {
  userFullName: string;
  userEmail:string;
  startTime: Date;
  endTime:Date;
  durationInMins: number;
  status: SessionStatus;
  fees: number;
  sessionId: string;
}
export default interface ISessionListingPsychUseCase {
  execute(dto: SessionListingDTO): Promise<{sessions:SessionListingPsychItem[],paginationData:PaginationData}>;
}
