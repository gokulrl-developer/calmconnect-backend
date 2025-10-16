import { SessionListingDTO } from "../../dtos/admin.dto";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import ISessionListingAdminUseCase from "../../interfaces/ISessionListingAdminUseCase";
import { toSessionListingAdminResponse } from "../../mappers/SessionMapper";
import { calculatePagination } from "../../utils/calculatePagination";

export default class SessionListingAdminUseCase
  implements ISessionListingAdminUseCase
{
  constructor(
    private readonly _sessionRepository: ISessionRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _psychRepository: IPsychRepository
  ) {}
  async execute(dto: SessionListingDTO) {
    console.log(dto)
    const filteredData = await this._sessionRepository.listSessionsByAdmin(
      dto.status,
      dto.skip,
      dto.limit
    );
    const sessions=filteredData.sessions;
    const results = await Promise.all(
      sessions.map(async (session) => {
        const user = await this._userRepository.findById(session.user);
        const psych = await this._psychRepository.findById(session.psychologist);
        const userFullName = user
          ? `${user.firstName} ${user.lastName}`
          : "Unknown User";
        const psychFullName = psych
          ? `${psych.firstName} ${psych.lastName}`
          : "Unknown Psychologist";

        const userEmail = user?.email || "";
        const psychEmail = psych?.email || "";

        return toSessionListingAdminResponse(
          session,
          psychFullName,
          userFullName,
          psychEmail,
          userEmail
        );
      })
    );
    return {sessions:results,paginationData:calculatePagination(filteredData.totalItems,dto.skip,dto.limit)};
  }
}
