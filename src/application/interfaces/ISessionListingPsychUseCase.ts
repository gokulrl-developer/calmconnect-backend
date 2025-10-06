import { SessionListingDTO } from "../dtos/psych.dto";

export interface SessionListingPsychItem {
  user: string;
  startTime: string;
  durationInMins: number;
  status: string;
  fees: number;
  sessionId: string;
}
export default interface ISessionListingPsychUseCase {
  execute(dto: SessionListingDTO): Promise<SessionListingPsychItem[]>;
}
