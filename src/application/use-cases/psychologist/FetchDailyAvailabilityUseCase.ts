import IFetchDailyAvailabilityUseCase, { DailyAvailability } from "../../interfaces/IFetchDailyAvailabilityUseCase";
import { FetchDailyAvailabilityDTO } from "../../dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { mapDomainToDailyAvailabilityRule } from "../../mappers/AvailabilityRuleMapper";
import AvailabilityRule from "../../../domain/entities/availability-rule.entity";
import SpecialDay from "../../../domain/entities/special-day.entity";
import QuickSlot from "../../../domain/entities/quick-slot.entity";
import { mapDomainToDailySpecialDay } from "../../mappers/SpecialDayMapper";
import { mapDomainToDailyQuickSlot } from "../../mappers/QuickSlotMapper";

export default class FetchDailyAvailabilityUseCase implements IFetchDailyAvailabilityUseCase {
  constructor(
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _specialDayRepository: ISpecialDayRepository,
    private readonly _quickSlotRepository: IQuickSlotRepository
  ) {}

  async execute(dto: FetchDailyAvailabilityDTO): Promise<DailyAvailability> {
    const { psychId, date } = dto;
    const weekDay = new Date(date).getDay();       // 0-6

    const availabilityRule: AvailabilityRule | null = await this._availabilityRuleRepository.findActiveByWeekDayPsych(weekDay, psychId);
    if (!availabilityRule) {
      throw new AppError(ERROR_MESSAGES.AVAILABILITY_RULE_NOT_FOUND, AppErrorCodes.NOT_FOUND);
    }

    const specialDay: SpecialDay | null = await this._specialDayRepository.findActiveByDatePsych(new Date(date), psychId);

    const quickSlots: QuickSlot[] = await this._quickSlotRepository.findActiveByDatePsych(new Date(date), psychId);

    const dailyAvailabilityRule = specialDay
      ? mapDomainToDailySpecialDay(specialDay)
      : mapDomainToDailyAvailabilityRule(availabilityRule, new Date(date));

    const dailyQuickSlots = quickSlots.map(mapDomainToDailyQuickSlot);

    return {
      availabilityRule: !specialDay? mapDomainToDailyAvailabilityRule(availabilityRule, new Date(date)):undefined, 
      specialDay: specialDay ? mapDomainToDailySpecialDay(specialDay) : undefined,
      quickSlots: dailyQuickSlots
    };
  }
}
