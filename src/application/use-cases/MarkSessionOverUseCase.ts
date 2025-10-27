import ISessionRepository from "../../domain/interfaces/ISessionRepository";
import { ERROR_MESSAGES } from "../constants/error-messages.constants";
import IMarkSessionOverUseCase, { MarkSessionOverPayload } from "../interfaces/IMarkSessionOverUseCase";

export default class MarkSessionOverUseCase implements IMarkSessionOverUseCase {
  constructor(private readonly _sessionRepo: ISessionRepository) {}

  async execute(payload:MarkSessionOverPayload): Promise<void> {
    const session = await this._sessionRepo.findById(payload.sessionId);

    if (!session) {
      throw new Error(ERROR_MESSAGES.SESSION_NOT_FOUND)
    }

    if (session.status !== "scheduled") {
        return;
    }

    session.status = "ended";

    await this._sessionRepo.create(session);

    return ;
  }
}
