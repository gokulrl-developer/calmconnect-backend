import IComplaintDetailsByAdminUseCase from "../../interfaces/IComplaintDetailsByAdminUseCase.js";
import { ComplaintDetailsByAdminDTO } from "../../dtos/admin.dto.js";
import IComplaintRepository from "../../../domain/interfaces/IComplaintRepository.js";
import IUserRepository from "../../../domain/interfaces/IUserRepository.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import { mapDomainToAdminComplaintDetails } from "../../mappers/ComplaintMapper.js";
import AppError from "../../error/AppError.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";


export default class ComplaintDetailsByAdminUseCase
  implements IComplaintDetailsByAdminUseCase
{
  constructor(
    private _complaintRepository: IComplaintRepository,
    private _userRepository: IUserRepository,
    private _psychologistRepository: IPsychRepository,
    private _sessionRepository: ISessionRepository
  ) {}

  async execute(dto: ComplaintDetailsByAdminDTO) {
    const complaint = await this._complaintRepository.findById(dto.complaintId);
    if (!complaint) {
      throw new AppError(
        ERROR_MESSAGES.COMPLAINT_NOT_FOUND,
        AppErrorCodes.COMPLAINT_NOT_FOUND
      );
    }

    const user = await this._userRepository.findById(complaint.user);
    const psychologist = await this._psychologistRepository.findById(
      complaint.psychologist
    );
    const session = await this._sessionRepository.findById(complaint.session);

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        AppErrorCodes.USER_NOT_FOUND
      );
    }
    if (!psychologist) {
      throw new AppError(
        ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND,
        AppErrorCodes.PSYCHOLOGIST_NOT_FOUND
      );
    }
    if (!session) {
      throw new AppError(
        ERROR_MESSAGES.SESSION_NOT_FOUND,
        AppErrorCodes.SESSION_NOT_FOUND
      );
    }
    return mapDomainToAdminComplaintDetails(
      complaint,
      user,
      psychologist,
      session
    );
  }
}
