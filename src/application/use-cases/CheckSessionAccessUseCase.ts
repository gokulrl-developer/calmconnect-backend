import ISessionRepository from "../../domain/interfaces/ISessionRepository";
import { CheckSessionAccessDTO } from "../dtos/shared.dto";
import ICheckSessionAccessUseCase, { SessionAccessPayload } from "../interfaces/ICheckSessionAccessUseCase";
import { toSessionDetailsInVideoCall } from "../mappers/SessionMapper";


export default class CheckSessionAccessUseCase implements ICheckSessionAccessUseCase {
  constructor(private readonly _sessionRepo: ISessionRepository) {}

  async execute(dto: CheckSessionAccessDTO): Promise<SessionAccessPayload> {
    const session = await this._sessionRepo.findById(dto.sessionId);

    if (!session) {
      return { allowed: false, reason: "Session not found" };
    }
    if (session.user !== dto.userId && session.psychologist !== dto.psychId) {
      return { allowed: false, reason: "Unauthorized access" };
    }

    const now = new Date();
    const openTime = new Date(session.startTime.getTime() - 5 * 60 * 1000);
    const closeTime = session.endTime;

    if (now < openTime) {
      return { allowed: false, reason: "Session not open yet" };
    }
    if (now > closeTime) {
      return { allowed: false, reason: "Session expired" };
    }

    return { allowed: true, session:toSessionDetailsInVideoCall(session) };
  }
}
