import { ComplainthIstoryDTO, ComplaintListingByAdminDTO } from "../../dtos/admin.dto";
import IComplaintRepository from "../../../domain/interfaces/IComplaintRepository";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import { mapDomainToAdminComplainHistoryItem, mapDomainToAdminComplaintListItem } from "../../mappers/ComplaintMapper";
import { calculatePagination } from "../../utils/calculatePagination";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import IComplaintHistoryByPsychUseCase from "../../interfaces/IComplaintHistoryByPsychUseCase";

export default class ComplaintHistoryByPsychUseCase
  implements IComplaintHistoryByPsychUseCase
{
  constructor(
    private _complaintRepository: IComplaintRepository,
    private _userRepository: IUserRepository,
    private _psychologistRepository: IPsychRepository,
    private _sessionRepository: ISessionRepository
  ) {}

  async execute(dto: ComplainthIstoryDTO) {
    const { psychId,skip, limit} = dto;

    const { complaints, totalItems } =
      await this._complaintRepository.findComplaintsByPsychologist({
        psychId,
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
        return mapDomainToAdminComplainHistoryItem(
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
