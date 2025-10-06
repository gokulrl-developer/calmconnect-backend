import { SessionListingDTO } from "../dtos/user.dto";

export interface SessionListingUserItem {
  psychologist: string;
  startTime: string;
  durationInMins: number;
  status: string;
  fees: number;
  sessionId: string;
}
export default interface ISessionListingUserUseCase {
  execute(dto: SessionListingDTO): Promise<SessionListingUserItem[]>;
}
