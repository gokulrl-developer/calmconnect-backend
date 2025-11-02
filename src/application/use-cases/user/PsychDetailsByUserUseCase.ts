
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IPsychDetailsByUserUseCase, { Slot } from "../../interfaces/IPsychDetailsByUserUseCase";
import { toPsychDetailsByUserResponse } from "../../mappers/PsychMapper";
import { PsychDetailsByUserDTO } from "../../dtos/user.dto";
import ISpecialDayRepository from "../../../domain/interfaces/ISpecialDayRepository";
import IQuickSlotRepository from "../../../domain/interfaces/IQuickSlotRepository";
import { getAvailableSlotsForDatePsych } from "../../utils/getAvailableSlotForDatePsych";
import { HHMMToIso } from "../../../utils/timeConverter";

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
    
       let availableSlots=getAvailableSlotsForDatePsych(specialDay,availabilityRules,quickSlots,sessions);
       let filteredSlots:Slot[]=[];
       for(let slot of availableSlots){
        const slotStartTime = new Date(HHMMToIso(slot.startTime, new Date(dto.date!)));
        if(slotStartTime.getTime()>Date.now()){
           filteredSlots.push(slot)
        }
       }
    return toPsychDetailsByUserResponse(psychologist,filteredSlots);
  }
}
