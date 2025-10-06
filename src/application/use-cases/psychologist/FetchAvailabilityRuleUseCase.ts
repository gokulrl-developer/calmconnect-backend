import { AvailabilityRuleDetailsDTO } from "../../dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IFetchAvailabilityRuleUseCase from "../../interfaces/IFetchAvailabilityRuleUseCase";

export default class FetchAvailabilityRuleUseCase implements IFetchAvailabilityRuleUseCase{
    constructor(
       private readonly _availabilityRuleRepository:IAvailabilityRuleRepository
    ){}
   async execute(dto:AvailabilityRuleDetailsDTO){
            
      const availabilityRule=await this._availabilityRuleRepository.findById(dto.availabilityRuleId);
      
      if(!availabilityRule){
         throw new AppError(ERROR_MESSAGES.AVAILABILITY_RULE_NOT_FOUND,AppErrorCodes.NOT_FOUND)
      }

        if(availabilityRule?.psychologist.toString()!== dto.psychId){
                 throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION,AppErrorCodes.FORBIDDEN_ERROR)  
              }
      return availabilityRule;
   } 
}