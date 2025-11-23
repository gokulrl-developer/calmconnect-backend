import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { CreateSpecialDayDTO } from "../../dtos/psych.dto.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import ICreateSpecialDayUseCase from "../../interfaces/ICreateSpecialDayUseCase.js";
import { mapCreateSpecialDayDTOToDomain } from "../../mappers/SpecialDayMapper.js";

export default class CreateSpecialDayUseCase
  implements ICreateSpecialDayUseCase
{
  constructor(
    private readonly _specialDayRepository: ISpecialDayRepository,
    private readonly _quickSlotRepository: IQuickSlotRepository
  ) {}
  async execute(dto: CreateSpecialDayDTO) {
    const specialDay = mapCreateSpecialDayDTOToDomain(dto);
    if (specialDay.type === "absent") {
      if (
        specialDay.startTime ||
        specialDay.endTime ||
        specialDay.durationInMins ||
        specialDay.bufferTimeInMins
      ) {
        throw new AppError(
          ERROR_MESSAGES.INVALID_FIELDS,
          AppErrorCodes.INVALID_INPUT
        );
      }
    } else {
      if (specialDay.type === "override") {
        if (!specialDay.startTime) {
          throw new AppError(
            ERROR_MESSAGES.START_TIME_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
        if (!specialDay.endTime) {
          throw new AppError(
            ERROR_MESSAGES.END_TIME_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
        if (
          !specialDay.durationInMins ||
          specialDay.durationInMins < 20 ||
          specialDay.durationInMins > 180
        ) {
          throw new AppError(
            ERROR_MESSAGES.DURATION_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
      }
    }
    const conflictingSpecialDay =
      await this._specialDayRepository.findActiveByDatePsych(
        dto.date,
        dto.psychId
      );
    if (conflictingSpecialDay) {
      throw new AppError(
        ERROR_MESSAGES.CONFLICTING_SPECIAL_DAY,
        AppErrorCodes.CONFLICT
      );
    }
    if (specialDay.type === "override") {
      const conflictingQuickSlots =
        await this._quickSlotRepository.findOverlappingActiveByTimeRangePsych(
          new Date(specialDay.startTime!),
          new Date(specialDay.endTime!),
          specialDay.psychologist
        );
      if (conflictingQuickSlots.length > 0) {
        throw new AppError(
          ERROR_MESSAGES.CONFLICTING_QUICK_SLOT,
          AppErrorCodes.CONFLICT
        );
      }
    }
    await this._specialDayRepository.create(specialDay);
  }
}
