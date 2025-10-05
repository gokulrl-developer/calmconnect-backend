import Session from "../../../domain/entities/session.entity";
import Psychologist from "../../../domain/entities/psychologist.entity";
import ICreateOrderUseCase, { CreateOrderResponse } from "../../interfaces/ICreateOrderUseCase";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import IHolidayRepository from "../../../domain/interfaces/IHolidayRepository";
import { HHMMToIso, isoToHHMM } from "../../../utils/timeConverter";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import generateSlots from "../../utils/generateSlots";
import { CreateOrderDTO } from "../../../domain/dtos/user.dto";
import IPaymentProvider from "../../../domain/interfaces/IPaymentProvider";

export default class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    private readonly _psychRepository: IPsychRepository,
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _holidayRepository: IHolidayRepository,
    private readonly _sessionRepository: ISessionRepository,
    private readonly _paymentProvider: IPaymentProvider
  ) {}

  async execute(dto: CreateOrderDTO): Promise<CreateOrderResponse> {

    const psychologist: Psychologist | null = await this._psychRepository.findById(dto.psychId);
    if (!psychologist) {
      throw new AppError(ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND, AppErrorCodes.NOT_FOUND);
    }

    const date = new Date(dto.date);
    const availabilityRule = await this._availabilityRuleRepository.findByDatePsych(date,dto.psychId);
    const holiday = await this._holidayRepository.findByDatePsych(date,dto.psychId);

    let slots = generateSlots(availabilityRule, holiday, date);

    const requiredSlot = slots.find(slot => slot.startTime === dto.startTime);
    if (!requiredSlot) {
      throw new AppError(ERROR_MESSAGES.SLOTS_OPEN_TIME_INVALID, AppErrorCodes.INVALID_INPUT);
    } 

    const existingSession = await this._sessionRepository.findSessionByPsychStartTime(new Date(HHMMToIso(requiredSlot.startTime, date)),dto.psychId);
    if (existingSession) {
      throw new AppError(ERROR_MESSAGES.SLOT_UNAVAILABLE,AppErrorCodes.NOT_FOUND);
    }

    const duration = availabilityRule?.durationInMins!;
    const fees = requiredSlot.quick
      ? psychologist.quickSlotHourlyFees! * duration / 60
      : psychologist.hourlyFees! * duration / 60;
    const paymentOrder = await this._paymentProvider.createOrder({
      amount: Math.round(fees * 100), 
      currency: "INR"
    });
    console.log(paymentOrder)
    const session = await this._sessionRepository.create({
      psychologist: dto.psychId,
      user: dto.userId,
      startTime: HHMMToIso(requiredSlot.startTime, date),
      durationInMins: duration,
      transactionIds: [],
      status: "pending",
      fees,
    });
    console.log("before returning",paymentOrder,session)
    return {
      providerOrderId: paymentOrder.providerOrderId,
      amount: Math.round(fees * 100),
      sessionId:session.id!
    };
  }
}
