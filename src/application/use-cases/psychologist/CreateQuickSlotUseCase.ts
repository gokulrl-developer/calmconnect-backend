import QuickSlot from "../../../domain/entities/quick-slot.entity.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import { timeStringToMinutes } from "../../../utils/timeConverter.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { CreateQuickSlotDTO } from "../../dtos/psych.dto.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import ICreateQuickSlotUseCase from "../../interfaces/ICreateQuickSlotUseCase.js";
import { mapCreateQuickSlotDTOToDomain } from "../../mappers/QuickSlotMapper.js";


export default class CreateQuickSlotUseCase implements ICreateQuickSlotUseCase {
  constructor(
    private readonly _quickSlotRepo: IQuickSlotRepository,
    private readonly _specialDayRepo: ISpecialDayRepository,
    private readonly _availabilityRuleRepo: IAvailabilityRuleRepository
  ) {}

  async execute(dto: CreateQuickSlotDTO): Promise<void> {
    const quickSlot: QuickSlot = mapCreateQuickSlotDTOToDomain(dto);

    const overlappingQuickSlots = await this._quickSlotRepo.findOverlappingActiveByTimeRangePsych(
      quickSlot.startTime,
      quickSlot.endTime,
      quickSlot.psychologist
    );
    if (overlappingQuickSlots.length>0) {
      throw new AppError(ERROR_MESSAGES.CONFLICTING_QUICK_SLOT, AppErrorCodes.CONFLICT);
    }

    const overlappingSpecialDay = await this._specialDayRepo.findOverlappingActiveByTimeRangePsych(
      quickSlot.startTime,
      quickSlot.endTime,
      quickSlot.psychologist
    );
    if (overlappingSpecialDay) {
      throw new AppError(ERROR_MESSAGES.CONFLICTING_SPECIAL_DAY, AppErrorCodes.CONFLICT);
    }

    const weekDay = quickSlot.date.getDay(); 
    const availabilityRules = await this._availabilityRuleRepo.findActiveByWeekDayPsych(
      weekDay,
      quickSlot.psychologist
    );
    const specialDay=await this._specialDayRepo.findActiveByDatePsych(new Date(quickSlot.date),quickSlot.psychologist)

    if(availabilityRules.length===0 && ! specialDay){
    throw new AppError(ERROR_MESSAGES.AVAILABILITY_NOT_SET,AppErrorCodes.CONFLICT)
  }

  for(const availabilityRule of availabilityRules){
      const slotStartMinutes = quickSlot.startTime.getHours() * 60 + quickSlot.startTime.getMinutes();
      const slotEndMinutes = quickSlot.endTime.getHours() * 60 + quickSlot.endTime.getMinutes();
      const ruleStartMinutes = timeStringToMinutes(availabilityRule.startTime);
      const ruleEndMinutes = timeStringToMinutes(availabilityRule.endTime);

      if (specialDay===null &&((slotStartMinutes > ruleStartMinutes&& slotStartMinutes<ruleEndMinutes)||(slotEndMinutes < ruleEndMinutes && slotEndMinutes>ruleStartMinutes))) {
        throw new AppError(
          ERROR_MESSAGES.CONFLICTING_AVAILABILITY_RULE,
          AppErrorCodes.CONFLICT
        );
      }
    }
    await this._quickSlotRepo.create(quickSlot);
  }
}
