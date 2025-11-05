import IComplaintDetailsByUserUseCase from "../../interfaces/IComplaintDetailsByUserUseCase";
import { ComplaintDetailsDTO } from "../../dtos/user.dto";
import IComplaintRepository from "../../../domain/interfaces/IComplaintRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import { mapDomainToUserComplaintDetails } from "../../mappers/ComplaintMapper";
import AppError from "../../error/AppError";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";

export default class ComplaintDetailsByUserUseCase implements IComplaintDetailsByUserUseCase {
  constructor(
    private _complaintRepository: IComplaintRepository,
    private _psychologistRepository: IPsychRepository,
    private _sessionRepository: ISessionRepository
  ) {}

  async execute(dto: ComplaintDetailsDTO) {
    const complaint = await this._complaintRepository.findById(dto.complaintId);
    if (!complaint) {
      throw new AppError(ERROR_MESSAGES.COMPLAINT_NOT_FOUND, AppErrorCodes.COMPLAINT_NOT_FOUND);
    }

    const psychologist = await this._psychologistRepository.findById(complaint.psychologist);
    const session = await this._sessionRepository.findById(complaint.session);

    if (!psychologist) {
      throw new AppError(ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND, AppErrorCodes.PSYCHOLOGIST_NOT_FOUND);
    }
    if (!session) {
      throw new AppError(ERROR_MESSAGES.THERAPY_SESSION_NOT_FOUND, AppErrorCodes.SESSION_NOT_FOUND);
    }

    return mapDomainToUserComplaintDetails(complaint, psychologist, session);
  }
}
