import IComplaintResolutionUseCase from "../../interfaces/IComplaintResolutionUseCase";
import { ComplaintResolutionDTO } from "../../dtos/admin.dto";
import IComplaintRepository from "../../../domain/interfaces/IComplaintRepository";
import AppError from "../../error/AppError";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import { mapComplaintResolutionDTOToDomain } from "../../mappers/ComplaintMapper";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import { IEventBus } from "../../interfaces/events/IEventBus";

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

    if (existingComplaint.status === "resolved") {
      throw new AppError(ERROR_MESSAGES.COMPLAINT_ALREADY_RESOLVED, AppErrorCodes.COMPLAINT_ALREADY_RESOLVED);
    }

    const updatedComplaint = mapComplaintResolutionDTOToDomain(dto, existingComplaint);
    const complaint=await this._complaintRepository.update(dto.complaintId, updatedComplaint);
    const psychologist=await this._psychRepository.findById(complaint?.psychologist!)
    await this._eventBus.emit("complaint.resolved",{
      complaintId:dto.complaintId,
      userId:complaint?.user!,
      psychologistFullName:psychologist?`${psychologist.firstName} ${psychologist.lastName}`:"N/A"
    })
  }
}
