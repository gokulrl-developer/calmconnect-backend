import { ListComplaintsDTO } from "../../dtos/user.dto";
import IComplaintRepository from "../../../domain/interfaces/IComplaintRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import { mapDomainToUserComplaintListItem } from "../../mappers/ComplaintMapper";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import IComplaintListingByUserUseCase from "../../interfaces/IComplaintListinByUserUseCase";
import { calculatePagination } from "../../utils/calculatePagination";

export default class ComplaintListingByUserUseCase implements IComplaintListingByUserUseCase {
  constructor(
    private _complaintRepository: IComplaintRepository,
    private _psychologistRepository: IPsychRepository,
    private _sessionRepository: ISessionRepository
  ) {}

  async execute(dto: ListComplaintsDTO) {
    const { userId, skip, limit } = dto;

    const { complaints, totalItems } = await this._complaintRepository.findComplaintsByUser(
      userId,
      skip,
      limit
    );

    const items = await Promise.all(
      complaints.map(async (complaint) => {
        const psychologist = await this._psychologistRepository.findById(complaint.psychologist);
        const session = await this._sessionRepository.findById(complaint.session);
        return mapDomainToUserComplaintListItem(complaint, psychologist, session);
      })
    );

    const paginationData = calculatePagination(totalItems, skip, limit);

    return { complaints: items, paginationData };
  }
}
