import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository.js";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository.js";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants.js";
import { AppErrorCodes } from "../../error/app-error-codes.js";
import AppError from "../../error/AppError.js";
import IPsychDetailsByUserUseCase, { Slot } from "../../interfaces/IPsychDetailsByUserUseCase.js";
import { toPsychDetailsByUserResponse } from "../../mappers/PsychMapper.js";
import { PsychDetailsByUserDTO } from "../../dtos/user.dto.js";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository.js";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository.js";
import { getAvailableSlotsForDatePsych } from "../../utils/getAvailableSlotForDatePsych.js";
import { HHMMToIso } from "../../../utils/timeConverter.js";

export default class PsychDetailsByUserUseCase
  implements IPsychDetailsByUserUseCase
{
  constructor(
    private readonly _psychRepository: IPsychRepository,
private readonly _availabilityRuleRepository: IAvailabilityRuleRepository,
    private readonly _specialDayRepository:ISpecialDayRepository,
    private readonly _quickSlotRepository:IQuickSlotRepository,
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
    
    const selectedDate = dto.date ? new Date(dto.date) : new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if(startOfToday>selectedDate){
      throw new AppError(ERROR_MESSAGES.SELECTED_DATE_PASSED,AppErrorCodes.VALIDATION_ERROR)
    }
        const weekDay=new Date(selectedDate).getDay()
    
        const availabilityRules = await this._availabilityRuleRepository.findActiveByWeekDayPsych(weekDay,dto.psychId);
        const specialDay =await this._specialDayRepository.findActiveByDatePsych(selectedDate,dto.psychId);
        const quickSlots =await this._quickSlotRepository.findActiveByDatePsych(selectedDate,dto.psychId)  
        const sessions =await this._sessionRepository.findBookedSessions(selectedDate,dto.psychId)
    
       const availableSlots=getAvailableSlotsForDatePsych(specialDay,availabilityRules,quickSlots,sessions);
       const filteredSlots:Slot[]=[];
       for(const slot of availableSlots){
        const slotStartTime = new Date(HHMMToIso(slot.startTime, new Date(dto.date!)));
        if(slotStartTime.getTime()>Date.now()){
           filteredSlots.push(slot)
        }
       }
    return toPsychDetailsByUserResponse(psychologist,filteredSlots);
  }
}
