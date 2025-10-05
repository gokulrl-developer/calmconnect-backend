import { FetchCheckoutDataDTO } from "../../../domain/dtos/user.dto";
import Psychologist from "../../../domain/entities/psychologist.entity";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import IHolidayRepository from "../../../domain/interfaces/IHolidayRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import { HHMMToIso, isoToHHMM } from "../../../utils/timeConverter";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IFetchCheckoutDataUseCase, { CheckoutData } from "../../interfaces/IFetchCheckoutDataUseCase";
import generateSlots from "../../utils/generateSlots";


export default class FetchCheckoutDataUseCase implements IFetchCheckoutDataUseCase {
  constructor(
    private readonly _psychRepository: IPsychRepository,
    private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _holidayRepository: IHolidayRepository,
    private readonly _sessionRepository: ISessionRepository
  ) {}

  async execute(dto: FetchCheckoutDataDTO): Promise<CheckoutData> {

    const psychologist: Psychologist | null = await this._psychRepository.findById(dto.psychId);
    if (!psychologist) {
      throw new AppError(ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND, AppErrorCodes.NOT_FOUND);
    }

    const date = dto.date ? new Date(dto.date) : new Date();

    const availabilityRule = await this._availabilityRuleRepository.findByDatePsych(date,dto.psychId);
    const holiday = await this._holidayRepository.findByDatePsych(date,dto.psychId);

    let slots = generateSlots(availabilityRule, holiday, date);

    const bookedSessions = await this._sessionRepository.findBookedSessions(date, dto.psychId);
    const bookedStartTimes = bookedSessions.map(s => {
      return isoToHHMM(s.startTime);
    });

    slots = slots.filter(slot => !bookedStartTimes.includes(slot.startTime));
    const requiredSlot = slots.find(slot => slot.startTime === dto.startTime);
    if (!requiredSlot) {
      throw new AppError(ERROR_MESSAGES.SLOTS_OPEN_TIME_INVALID, AppErrorCodes.INVALID_INPUT);
    }
    if(requiredSlot.quick===true &&((new Date(dto.date).getTime()-new Date().getTime())/(1000*60))>availabilityRule?.quickSlotsReleaseWindowMins!){
        throw new AppError(ERROR_MESSAGES.QUICK_SLOT_UNRELEASED,AppErrorCodes.NOT_FOUND)
    }
    
    const startTimeIso = HHMMToIso(requiredSlot.startTime, date);
    const endTimeIso = HHMMToIso(requiredSlot.endTime, date);

    const duration = availabilityRule?.durationInMins;

    const fees = requiredSlot.quick
      ? psychologist.quickSlotHourlyFees! * duration! / 60 
      : psychologist.hourlyFees! * duration! / 60;

    const checkoutData: CheckoutData = {
      startTime: startTimeIso,
      endTime: endTimeIso,
      durationInMins:duration!,
      quickSlot: requiredSlot.quick,
      fees: Math.round(fees), 
    };

    return checkoutData;
  }
}
