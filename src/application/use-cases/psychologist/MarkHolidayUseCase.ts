import { MarkHolidayDTO } from "../../dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import IHolidayRepository from "../../../domain/interfaces/IHolidayRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IMarkHolidayUseCase from "../../interfaces/IMarkHolidayUseCase";
import { toHolidayDomainMapper } from "../../mappers/HolidayMapper";

export default class MarkHolidayUseCase implements IMarkHolidayUseCase{
    constructor(
      private readonly _holidayRepository:IHolidayRepository,
      private readonly _availabilityRuleRepository:IAvailabilityRuleRepository
    ){}

    async execute(dto:MarkHolidayDTO){
        const holidayEntity=toHolidayDomainMapper(dto);
        console.log(dto)
        const availabilityRule=await this._availabilityRuleRepository.findByDatePsych(new Date(dto.date),dto.psychId);
        if(!availabilityRule){
          throw new AppError(ERROR_MESSAGES.AVAILABILITY_NOT_SET,AppErrorCodes.NOT_FOUND)
        }
        holidayEntity.psychologist=availabilityRule.psychologist
        const updatedHolidayEntity=await this._holidayRepository.updateDailySlots(holidayEntity);
        
    }
}