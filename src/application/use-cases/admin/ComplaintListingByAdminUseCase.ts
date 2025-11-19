import IComplaintListingByAdminUseCase from "../../interfaces/IComplaintListingByAdminUseCase.js";
import { ComplaintListingByAdminDTO } from "../../dtos/admin.dto.js";
import IComplaintRepository from "../../../domain/interfaces/IComplaintRepository.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import { mapDomainToAdminComplaintListItem } from "../../mappers/ComplaintMapper.js";
import { calculatePagination } from "../../utils/calculatePagination.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";


export default class ComplaintListingByAdminUseCase
  implements IComplaintListingByAdminUseCase
{
  constructor(
    private _complaintRepository: IComplaintRepository,
    private _userRepository: IUserRepository,
    private _psychologistRepository: IPsychRepository,
    private _sessionRepository: ISessionRepository
  ) {}

  async execute(dto: ComplaintListingByAdminDTO) {
    const { skip, limit, status, search } = dto;

    const { complaints, totalItems } =
      await this._complaintRepository.findComplaintsWithSearchFilter({
        status,
        search,
        skip,
        limit,
      });

    const items = await Promise.all(
      complaints.map(async (complaint) => {
        const user = await this._userRepository.findById(complaint.user);
        const psychologist = await this._psychologistRepository.findById(
          complaint.psychologist
        );
        const session = await this._sessionRepository.findById(
          complaint.session
        );
        return mapDomainToAdminComplaintListItem(
          complaint,
          user,
          psychologist,
          session
        );
      })
    );

    const paginationData = calculatePagination(totalItems, skip, limit);
    return { complaints: items, paginationData };
  }
}
