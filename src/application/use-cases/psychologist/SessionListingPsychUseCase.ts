import { SessionListingDTO } from "../../dtos/psych.dto";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import ISessionListingPsychUseCase from "../../interfaces/ISessionListingPsychUseCase";
import { toSessionListingPsychResponse } from "../../mappers/SessionMapper";
import { calculatePagination } from "../../utils/calculatePagination";

export default class SessionListingPsychUseCase
  implements ISessionListingPsychUseCase
{
  constructor(
    private readonly _sessionRepository: ISessionRepository,
    private readonly _userRepository: IUserRepository
  ) {}
  async execute(dto: SessionListingDTO) {
    const filteredData = await this._sessionRepository.listSessionsByPsych(
      dto.psychId,
      dto.status,
      dto.skip,
      dto.limit
    );
    const sessions=filteredData.sessions;
    const results = await Promise.all(
      sessions.map(async (session) => {
        const user = await this._userRepository.findById(session.user);
        const userFullName = user
          ? `${user.firstName} ${user.lastName}`
          : "Unknown User";
        const userEmail = user?.email || "";
        return toSessionListingPsychResponse(session, userFullName, userEmail);
      })
    );
    return {sessions:results,paginationData:calculatePagination(filteredData.totalItems,dto.skip,dto.limit)};
  }
}
