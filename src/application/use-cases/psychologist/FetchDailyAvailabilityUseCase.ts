import IFetchDailyAvailabilityUseCase, { DailyAvailability } from "../../interfaces/IFetchDailyAvailabilityUseCase.js";
import { FetchDailyAvailabilityDTO } from "../../dtos/psych.dto.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { mapDomainToDailyAvailabilityRule } from "../../mappers/AvailabilityRuleMapper.js";
import AvailabilityRule from "../../../domain/entities/availability-rule.entity.js";
import SpecialDay from "../../../domain/entities/special-day.entity.js";
import QuickSlot from "../../../domain/entities/quick-slot.entity.js";
import { mapDomainToDailySpecialDay } from "../../mappers/SpecialDayMapper.js";
import { mapDomainToDailyQuickSlot } from "../../mappers/QuickSlotMapper.js";

export default class FetchDailyAvailabilityUseCase implements IFetchDailyAvailabilityUseCase {
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _specialDayRepository: ISpecialDayRepository,
    private readonly _quickSlotRepository: IQuickSlotRepository
  ) {}

  async execute(dto: FetchDailyAvailabilityDTO): Promise<DailyAvailability> {
    const { psychId, date } = dto;
    const weekDay = new Date(date).getDay();       // 0-6

    const availabilityRules = await this._availabilityRuleRepository.findActiveByWeekDayPsych(weekDay, psychId);
    if (availabilityRules.length===0) {
      throw new AppError(ERROR_MESSAGES.AVAILABILITY_NOT_SET, AppErrorCodes.CONFLICT);
    }

    const specialDay: SpecialDay | null = await this._specialDayRepository.findActiveByDatePsych(new Date(date), psychId);

    const quickSlots: QuickSlot[] = await this._quickSlotRepository.findActiveByDatePsych(new Date(date), psychId);

    const activeAvailabilityRules = availabilityRules.map((availabilityRule:AvailabilityRule)=> mapDomainToDailyAvailabilityRule(availabilityRule, new Date(date)));

    const dailyQuickSlots = quickSlots.map(mapDomainToDailyQuickSlot);

    return {
      availabilityRules: !specialDay? activeAvailabilityRules:[], 
      specialDay: specialDay ? mapDomainToDailySpecialDay(specialDay) : undefined,
      quickSlots: dailyQuickSlots
    };
  }
}
