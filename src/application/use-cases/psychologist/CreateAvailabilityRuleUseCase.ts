import { CreateAvaialabilityRuleDTO } from "../../../domain/dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import ICreateAvailabilityRuleUseCase from "../../interfaces/ICreateAvailabilityRuleUseCase";
import { toAvailabilityRuleDomain } from "../../mappers/AvailabilityRuleMapper";

export default class CreateAvailabilityRuleUseCase implements ICreateAvailabilityRuleUseCase{
  constructor(
     private readonly _availabilityRuleRepository:IAvailabilityRuleRepository
  ){}

  async execute(dto:CreateAvaialabilityRuleDTO){
     const endDate=new Date(dto.endDate)
     endDate.setUTCDate(endDate.getUTCDate()+1);
     const startDate=new Date(dto.startDate)
     const conflictingRules=await this._availabilityRuleRepository.findByTimePeriod(startDate,endDate);

     if(conflictingRules.length>0){
        throw new AppError(ERROR_MESSAGES.OVERLAPPING_AVAILABILITY_RULE,AppErrorCodes.OVERLAPPING_AVAILABILITY_RULE)
      }
      const availabilityRule=toAvailabilityRuleDomain(dto)
      
      await this._availabilityRuleRepository.create(availabilityRule);
    
  }
}