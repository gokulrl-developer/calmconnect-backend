import ICreateComplaintUseCase from "../../interfaces/ICreateComplaintUseCase";
import { CreateComplaintDTO } from "../../dtos/user.dto";
import IComplaintRepository from "../../../domain/interfaces/IComplaintRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import { mapCreateComplaintDTOToDomain } from "../../mappers/ComplaintMapper";
import AppError from "../../error/AppError";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import { IEventBus } from "../../interfaces/events/IEventBus";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";

export default class CreateComplaintUseCase implements ICreateComplaintUseCase {
  constructor(
    private _complaintRepository: IComplaintRepository,
    private _sessionRepository: ISessionRepository,
    private _userRepository:IUserRepository,
    private _psychRepository:IPsychRepository,
    private _eventBus:IEventBus
  ) {}

  async execute(dto: CreateComplaintDTO): Promise<void> {
    const session = await this._sessionRepository.findById(dto.sessionId);
    if (!session) {
      throw new AppError(ERROR_MESSAGES.SESSION_NOT_FOUND, AppErrorCodes.THERAPY_SESSION_NOT_FOUND);
    }
    const existingComplaints=await this._complaintRepository.findAll({session:dto.sessionId});
    if(existingComplaints.length>0){
        throw new AppError(ERROR_MESSAGES.COMPLAINT_ALREADY_REGISTERED,AppErrorCodes.COMPLAINT_ALREADY_EXISTS)
    }
    if (session.user !== dto.userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION, AppErrorCodes.UNAUTHORISED_THERAPY_SESSION_ACCESS);
    }

    const complaint = mapCreateComplaintDTOToDomain(dto, session);

    const complaintCreated=await this._complaintRepository.create(complaint);
    const user=await this._userRepository.findById(dto.userId);
    const psychologist=await this._psychRepository.findById(session.psychologist);
    await this._eventBus.emit('complaint.raised', {
          complaintId:complaintCreated.id!,
          userFullName:user?`${user.firstName} ${user.lastName}`:"N/A",
          psychologistFullName:psychologist?`${psychologist.firstName} ${psychologist.lastName}`:"N/A",
          sessionId:session.id!,
        })
  }
}
