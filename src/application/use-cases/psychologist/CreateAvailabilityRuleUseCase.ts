import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { CreateAvaialabilityRuleDTO } from "../../dtos/psych.dto";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import ICreateAvailabilityRuleUseCase from "../../interfaces/ICreateAvailabilityRuleUseCase";
import { mapCreateAvailabilityRuleDTOToDomain } from "../../mappers/AvailabilityRuleMapper";

export default class CreateAvailabilityRuleUseCase implements ICreateAvailabilityRuleUseCase{
    constructor(
       private readonly _availabilityRuleRepository:IAvailabilityRuleRepository
    ){}
    async execute(dto:CreateAvaialabilityRuleDTO){
      const avaialbilityRule=mapCreateAvailabilityRuleDTOToDomain(dto);
      const conflictingAvailabilityRule=await this._availabilityRuleRepository.findActiveByWeekDayPsych(dto.weekDay,dto.psychId);
      if(conflictingAvailabilityRule){
        throw new AppError(ERROR_MESSAGES.CONFLICTING_AVAILABILITY_RULE,AppErrorCodes.CONFLICT)
      }   
      
      await this._availabilityRuleRepository.create(avaialbilityRule)
     
    }
}