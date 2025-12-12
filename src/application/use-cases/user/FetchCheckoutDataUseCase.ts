import { FetchCheckoutDataDTO } from "../../dtos/user.dto.js";
import Psychologist from "../../../domain/entities/psychologist.entity.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import { HHMMToIso} from "../../../utils/timeConverter.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IFetchCheckoutDataUseCase, { CheckoutData } from "../../interfaces/IFetchCheckoutDataUseCase.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import { getAvailableSlotsForDatePsych } from "../../utils/getAvailableSlotForDatePsych.js";

export default class FetchCheckoutDataUseCase
  implements IFetchCheckoutDataUseCase
{
  constructor(
    private readonly _psychRepository: IPsychRepository,
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _specialDayRepository: ISpecialDayRepository,
    private readonly _quickSlotRepository: IQuickSlotRepository,
    private readonly _sessionRepository: ISessionRepository
  ) {}

  async execute(dto: FetchCheckoutDataDTO): Promise<CheckoutData> {
    const psychologist: Psychologist | null =
      await this._psychRepository.findById(dto.psychId);
    if (!psychologist) {
      throw new AppError(
        ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );
    }

    const selectedDate = new Date(dto.date);
    const weekDay = new Date(dto.date).getDay();
    if (new Date(dto.startTime) < new Date()) {
      throw new AppError(
        ERROR_MESSAGES.SELECTED_SLOT_PASSED,
        AppErrorCodes.VALIDATION_ERROR
      );
    }
    const availabilityRules =
      await this._availabilityRuleRepository.findActiveByWeekDayPsych(
        weekDay,
        dto.psychId
      );
    const specialDay = await this._specialDayRepository.findActiveByDatePsych(
      selectedDate,
      dto.psychId
    );
    const quickSlots = await this._quickSlotRepository.findActiveByDatePsych(
      selectedDate,
      dto.psychId
    );
    const sessions = await this._sessionRepository.findBookedSessions(
      selectedDate,
      dto.psychId
    );

    const availableSlots = getAvailableSlotsForDatePsych(
      specialDay,
      availabilityRules,
      quickSlots,
      sessions
    );

    const requiredSlot = availableSlots.find(
      (slot) => slot.startTime === dto.startTime
    );
    if (!requiredSlot) {
      throw new AppError(
        ERROR_MESSAGES.SLOTS_OPEN_TIME_INVALID,
        AppErrorCodes.INVALID_INPUT
      );
    }

    const startTimeIso = HHMMToIso(requiredSlot.startTime, selectedDate);
    const endTimeIso = HHMMToIso(requiredSlot.endTime, selectedDate);

    const end = new Date(
      HHMMToIso(requiredSlot.endTime, selectedDate)
    ).getTime();
    const start = new Date(
      HHMMToIso(requiredSlot.startTime, selectedDate)
    ).getTime();
    const duration = (end - start) / (60 * 1000);

    const fees = (psychologist.hourlyFees! * duration!) / 60;
    const checkoutData: CheckoutData = {
      startTime: startTimeIso,
      endTime: endTimeIso,
      durationInMins: duration!,
      fees: Math.round(fees),
    };

    return checkoutData;
  }
}
