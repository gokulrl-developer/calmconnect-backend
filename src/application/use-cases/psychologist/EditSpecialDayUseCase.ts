import { EditSpecialDayDTO } from "../../dtos/psych.dto.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import IEditSpecialDayUseCase from "../../interfaces/IEditSpecialDayUseCase.js";
import { mapEditSpecialDayDTOToDomain } from "../../mappers/SpecialDayMapper.js";
import SpecialDay from "../../../domain/entities/special-day.entity.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";

export default class EditSpecialDayUseCase implements IEditSpecialDayUseCase {
  constructor(
    private readonly _specialDayRepository: ISpecialDayRepository,
    private readonly _quickSlotRepository: IQuickSlotRepository
  ) {}

  async execute(dto: EditSpecialDayDTO): Promise<void> {
    const existingSpecialDay = await this._specialDayRepository.findById(dto.specialDayId);
    if (!existingSpecialDay) {
      throw new AppError(ERROR_MESSAGES.SPECIAL_DAY_NOT_FOUND, AppErrorCodes.NOT_FOUND);
    }

    if(existingSpecialDay.psychologist !==dto.psychId){
            throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION,AppErrorCodes.FORBIDDEN_ERROR)
        }
    if (dto.type === "absent") {
      if (dto.startTime || dto.endTime || dto.durationInMins || dto.bufferTimeInMins) {
        throw new AppError(ERROR_MESSAGES.INVALID_FIELDS, AppErrorCodes.INVALID_INPUT);
      }
    } 

    const startTime = dto.type === "override" && dto.startTime ? new Date(dto.startTime) : existingSpecialDay.startTime!;
    const endTime = dto.type === "override" && dto.endTime ? new Date(dto.endTime) : existingSpecialDay.endTime!;

    const conflictingQuickSlots = await this._quickSlotRepository.findOverlappingActiveByTimeRangePsych(
      startTime,
      endTime,
      dto.psychId
    );

    if (conflictingQuickSlots.length > 0) {
      throw new AppError(ERROR_MESSAGES.CONFLICTING_QUICK_SLOT, AppErrorCodes.CONFLICT);
    }

    const updatedSpecialDay: SpecialDay = mapEditSpecialDayDTOToDomain(dto, existingSpecialDay);
    
    await this._specialDayRepository.update(existingSpecialDay.id!, updatedSpecialDay);
  }
}
