import Psychologist from "../../../domain/entities/psychologist.entity.js";
import ICreateOrderUseCase, {
  CreateOrderResponse,
} from "../../interfaces/ICreateOrderUseCase.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import { HHMMToIso } from "../../../utils/timeConverter.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import { CreateOrderDTO } from "../../dtos/user.dto.js";
import IPaymentProvider from "../../../domain/interfaces/IPaymentProvider.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import { getAvailableSlotsForDatePsych } from "../../utils/getAvailableSlotForDatePsych.js";
import { mapCreateOrderDTOToDomain } from "../../mappers/SessionMapper.js";

export default class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    private readonly _psychRepository: IPsychRepository,
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _specialDayRepository: ISpecialDayRepository,
    private readonly _quickSlotRepository: IQuickSlotRepository,
    private readonly _sessionRepository: ISessionRepository,
    private readonly _paymentProvider: IPaymentProvider
  ) {}

  async execute(dto: CreateOrderDTO): Promise<CreateOrderResponse> {
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

    const end = new Date(
      HHMMToIso(requiredSlot.endTime, selectedDate)
    ).getTime();
    const start = new Date(
      HHMMToIso(requiredSlot.startTime, selectedDate)
    ).getTime();
    const duration = (end - start) / (60 * 1000);
    const fees = (psychologist.hourlyFees! * duration!) / 60;
    const paymentOrder = await this._paymentProvider.createOrder({
      amount: Math.round(fees * 100),
      currency: "INR",
    });
    const sessionEntity = mapCreateOrderDTOToDomain(
      dto,
      new Date(HHMMToIso(requiredSlot.startTime, selectedDate)),
      new Date(HHMMToIso(requiredSlot.endTime, selectedDate)),
      duration,
      fees
    );
    const session = await this._sessionRepository.create(sessionEntity);
    return {
      providerOrderId: paymentOrder.providerOrderId,
      amount: Math.round(fees * 100),
      sessionId: session.id!,
    };
  }
}
