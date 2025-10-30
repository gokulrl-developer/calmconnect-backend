import { SessionListingDTO } from "../dtos/user.dto";
import PaginationData from "../utils/calculatePagination";

export interface SessionListingUserItem {
  psychFullName: string;
  psychEmail:string;
  startTime: Date;
  endTime: Date;
  durationInMins: number;
  status: "scheduled"|"cancelled"|"ended"|"pending";
  fees: number;
  sessionId: string;
}
export default interface ISessionListingUserUseCase {
  execute(dto: SessionListingDTO): Promise<{sessions:SessionListingUserItem[],paginationData:PaginationData}>;
}
