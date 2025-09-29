import { PsychDetailsByUserDTO } from "../../../domain/dtos/psych.dto";
import Psychologist from "../../../domain/entities/psychologist.entity";
import Session from "../../../domain/entities/session.entity";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import IHolidayRepository from "../../../domain/interfaces/IHolidayRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import { isoToHHMM } from "../../../utils/timeConverter";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IPsychDetailsByUserUseCase, { Slot } from "../../interfaces/IPsychDetailsByUserUseCase";
import { toPsychDetailsByUserResponse } from "../../mappers/PsychMapper";
import generateSlots from "../../utils/generateSlots";

export default class PsychDetailsByUserUseCase
  implements IPsychDetailsByUserUseCase
{
  constructor(
    private readonly _psychRepository: IPsychRepository,
    private readonly _availabilityRuleRepository:IAvailabilityRuleRepository,
    private readonly _holidayRepository:IHolidayRepository,
    private readonly _sessionRepository:ISessionRepository
  ) {}

  async execute(dto: PsychDetailsByUserDTO) {
    const psychologist = await this._psychRepository.findById(dto.psychId);

    if (!psychologist) {
      throw new AppError(
        ERROR_MESSAGES.PSYCHOLOGIST_NOT_FOUND,
        AppErrorCodes.NOT_FOUND
      );
    }
    if(!dto.date){
        dto.date=new Date().toISOString()
    }
     let availableSlots=[];
    const availabilityRule=await this._availabilityRuleRepository.findByDate(new Date(dto.date));
    const holiday=await this._holidayRepository.findByDate(new Date(dto.date));
    console.log("rule and holiday",availabilityRule,holiday)
    availableSlots=generateSlots(availabilityRule,holiday,new Date(dto.date));
    const scheduledSessions= await this._sessionRepository.findBookedSessions(new Date(dto.date),dto.psychId)
    const bookedSlots=scheduledSessions.map((session:Session)=>isoToHHMM(session.startTime));
     availableSlots.filter((slot:Slot)=>bookedSlots.includes(slot.startTime)===false)

    return toPsychDetailsByUserResponse(psychologist,availableSlots);
  }
}
