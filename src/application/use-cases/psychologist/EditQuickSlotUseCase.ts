import { EditQuickSlotDTO } from "../../dtos/psych.dto";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import QuickSlot from "../../../domain/entities/quick-slot.entity";
import IEditQuickSlotUseCase from "../../interfaces/IEditQuickSlotUseCase";
import { mapEditQuickSlotDTOToDomain } from "../../mappers/QuickSlotMapper";
import { timeStringToMinutes } from "../../../utils/timeConverter";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";

export default class EditQuickSlotUseCase implements IEditQuickSlotUseCase {
  constructor(
    private readonly _quickSlotRepo: IQuickSlotRepository,
    private readonly _specialDayRepo: ISpecialDayRepository,
    private readonly _availabilityRuleRepo: IAvailabilityRuleRepository
  ) {}

  async execute(dto: EditQuickSlotDTO): Promise<void> {
    const existingQuickSlot = await this._quickSlotRepo.findById(
      dto.quickSlotId
    );
    if (!existingQuickSlot) {
      throw new AppError(
        ERROR_MESSAGES.QUICK_SLOT_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );
    }

    if (existingQuickSlot.psychologist !== dto.psychId) {
      throw new AppError(
        ERROR_MESSAGES.UNAUTHORISED_ACTION,
        AppErrorCodes.FORBIDDEN_ERROR
      );
    }

    const startTime = dto.startTime ?? existingQuickSlot.startTime!;
    const endTime = dto.endTime ?? existingQuickSlot.endTime!;

    const overlappingQuickSlots =
      await this._quickSlotRepo.findOverlappingActiveByTimeRangePsych(
        startTime,
        endTime,
        dto.psychId
      );

    const conflictSlots = overlappingQuickSlots.filter(
      (slot) => slot.id !== existingQuickSlot.id
    );
    if (conflictSlots.length > 0) {
      throw new AppError(
        ERROR_MESSAGES.CONFLICTING_QUICK_SLOT,
        AppErrorCodes.CONFLICT
      );
    }

    const overlappingSpecialDay =
      await this._specialDayRepo.findOverlappingActiveByTimeRangePsych(
        startTime,
        endTime,
        dto.psychId
      );
    if (overlappingSpecialDay) {
      throw new AppError(
        ERROR_MESSAGES.CONFLICTING_SPECIAL_DAY,
        AppErrorCodes.CONFLICT
      );
    }

    const weekDay = startTime.getDay();
    const availabilityRule =await this._availabilityRuleRepo.findActiveByWeekDayPsych(weekDay, dto.psychId);
  const specialDay=await this._specialDayRepo.findActiveByDatePsych(existingQuickSlot.date,existingQuickSlot.psychologist)
  
    if (availabilityRule) {
      const slotStartMinutes =
        startTime.getHours() * 60 + startTime.getMinutes();
      const slotEndMinutes = endTime.getHours() * 60 + endTime.getMinutes();
      const ruleStartMinutes = timeStringToMinutes(availabilityRule.startTime);
      const ruleEndMinutes = timeStringToMinutes(availabilityRule.endTime);

      if (!specialDay &&
        (slotStartMinutes > ruleStartMinutes &&
          slotEndMinutes < ruleEndMinutes) ||
        (slotEndMinutes < ruleEndMinutes && slotEndMinutes > ruleStartMinutes)
      ) {
        throw new AppError(
          ERROR_MESSAGES.CONFLICTING_AVAILABILITY_RULE,
          AppErrorCodes.CONFLICT
        );
      }
    }

    const updatedQuickSlot: QuickSlot = mapEditQuickSlotDTOToDomain(
      dto,
      existingQuickSlot
    );

    await this._quickSlotRepo.update(existingQuickSlot.id!, updatedQuickSlot);
  }
}
