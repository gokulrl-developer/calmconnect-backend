import Session from "../../../domain/entities/session.entity";
import Psychologist from "../../../domain/entities/psychologist.entity";
import ICreateOrderUseCase, {
  CreateOrderResponse,
} from "../../interfaces/ICreateOrderUseCase";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import IHolidayRepository from "../../../domain/interfaces/ISpecialDayRepository";
import { HHMMToIso, isoToHHMM } from "../../../utils/timeConverter";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import { CreateOrderDTO } from "../../dtos/user.dto";
import IPaymentProvider from "../../../domain/interfaces/IPaymentProvider";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository";
import { getAvailableSlotsForDatePsych } from "../../utils/getAvailableSlotForDatePsych";

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

    const availabilityRule =
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
      availabilityRule,
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

    const duration = availabilityRule?.durationInMins;

    const fees = (psychologist.hourlyFees! * duration!) / 60;

    const paymentOrder = await this._paymentProvider.createOrder({
      amount: Math.round(fees * 100),
      currency: "INR",
    });
    console.log(paymentOrder);
    const session = await this._sessionRepository.create({
      psychologist: dto.psychId,
      user: dto.userId,
      startTime: new Date(HHMMToIso(requiredSlot.startTime, selectedDate)),
      endTime: new Date(HHMMToIso(requiredSlot.endTime, selectedDate)),
      durationInMins: duration,
      transactionIds: [],
      status: "pending",
      fees,
    });
    return {
      providerOrderId: paymentOrder.providerOrderId,
      amount: Math.round(fees * 100),
      sessionId: session.id!,
    };
  }
}
