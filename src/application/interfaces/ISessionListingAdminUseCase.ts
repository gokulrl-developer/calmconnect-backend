import { SessionListingDTO } from "../../domain/dtos/admin.dto";

export interface SessionListingAdminItem {
  user: string;
  psych: string;
  startTime: string;
  durationInMins: number;
  status: string;
  fees: number;
  sessionId: string;
}
export default interface ISessionListingAdminUseCase {
  execute(dto: SessionListingDTO): Promise<SessionListingAdminItem[]>;
}
