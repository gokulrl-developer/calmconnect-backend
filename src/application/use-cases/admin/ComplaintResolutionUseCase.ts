import IComplaintResolutionUseCase from "../../interfaces/IComplaintResolutionUseCase.js";
import { ComplaintResolutionDTO } from "../../dtos/admin.dto.js";
import IComplaintRepository from "../../../domain/interfaces/IComplaintRepository.js";
import AppError from "../../error/AppError.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import { mapComplaintResolutionDTOToDomain } from "../../mappers/ComplaintMapper.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { IEventBus } from "../../interfaces/events/IEventBus.js";
import { EventMapEvents } from "../../../domain/enums/EventMapEvents.js";
import { ComplaintStatus } from "../../../domain/enums/ComplaintStatus.js";

export default class ComplaintResolutionUseCase implements IComplaintResolutionUseCase {
  constructor(
    private _complaintRepository: IComplaintRepository,
    private _psychRepository:IPsychRepository,
    private _eventBus:IEventBus
  ) {}

  async execute(dto: ComplaintResolutionDTO): Promise<void> {
    const existingComplaint = await this._complaintRepository.findById(dto.complaintId);
    if (!existingComplaint) {
      throw new AppError(ERROR_MESSAGES.COMPLAINT_NOT_FOUND, AppErrorCodes.COMPLAINT_NOT_FOUND);
    }

    if (existingComplaint.status === ComplaintStatus.RESOLVED) {
      throw new AppError(ERROR_MESSAGES.COMPLAINT_ALREADY_RESOLVED, AppErrorCodes.COMPLAINT_ALREADY_RESOLVED);
    }

    const updatedComplaint = mapComplaintResolutionDTOToDomain(dto, existingComplaint);
    const complaint=await this._complaintRepository.update(dto.complaintId, updatedComplaint);
    if(!complaint){
      throw new AppError(ERROR_MESSAGES.COMPLAINT_UPDATION_FAILED,AppErrorCodes.COMPLAINT_UPDATION_FAILED)
    }
    const psychologist=await this._psychRepository.findById(complaint.psychologist!)
    await this._eventBus.emit(EventMapEvents.COMPLAINT_RESOLVED,{
      complaintId:dto.complaintId,
      userId:complaint.user!,
      psychologistFullName:psychologist?`${psychologist.firstName} ${psychologist.lastName}`:"N/A"
    })
  }
}
