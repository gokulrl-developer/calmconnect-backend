import { SessionListingDTO } from "../../dtos/user.dto.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import ISessionListingUserUseCase from "../../interfaces/ISessionListingUserUseCase.js";
import { toSessionListingUserResponse } from "../../mappers/SessionMapper.js";
import { calculatePagination } from "../../utils/calculatePagination.js";

export default class SessionListingUserUseCase
  implements ISessionListingUserUseCase
{
  constructor(
    private readonly _sessionRepository: ISessionRepository,
    private readonly _psychRepository: IPsychRepository
  ) {}
  async execute(dto: SessionListingDTO) {
    const filteredData = await this._sessionRepository.listSessionsByUser(
      dto.userId,
      dto.status,
      dto.skip,
      dto.limit
    );
    const sessions=filteredData.sessions;
    const results = await Promise.all(
      sessions.map(async (session) => {
        const psych = await this._psychRepository.findById(
          session.psychologist
        );
        const psychFullName = psych
          ? `${psych.firstName} ${psych.lastName}`
          : "Unknown Psychologist";

        const psychEmail = psych?.email || "";

        return toSessionListingUserResponse(session, psychFullName, psychEmail);
      })
    );
    return {sessions:results,paginationData:calculatePagination(filteredData.totalItems,dto.skip,dto.limit)};
  }
}
