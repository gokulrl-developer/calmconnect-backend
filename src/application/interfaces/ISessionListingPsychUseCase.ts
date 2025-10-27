import { SessionListingDTO } from "../dtos/psych.dto";
import PaginationData from "../utils/calculatePagination";

export interface SessionListingPsychItem {
  userFullName: string;
  userEmail:string;
  startTime: Date;
  endTime:Date;
  durationInMins: number;
  status: "scheduled"|"completed"|"cancelled"|"ended"|"pending";
  fees: number;
  sessionId: string;
}
export default interface ISessionListingPsychUseCase {
  execute(dto: SessionListingDTO): Promise<{sessions:SessionListingPsychItem[],paginationData:PaginationData}>;
}
