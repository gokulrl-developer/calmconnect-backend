import { DeleteAvailabilityRuleDTO } from "../../../domain/dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";
import { AppErrorCodes } from "../../error/app-error-codes";
import AppError from "../../error/AppError";
import IDeleteAvailabilityRuleUseCase from "../../interfaces/IDeleteAvailabilityRuleUseCase";

export default class DeleteAvailabilityRuleUseCase implements IDeleteAvailabilityRuleUseCase{
    constructor(
        private readonly _availabilityRuleRepository:IAvailabilityRuleRepository
    ){}
    async execute(dto:DeleteAvailabilityRuleDTO){
        const availabilityRule=await this._availabilityRuleRepository.findById(dto.availabilityRuleId);
         if(!availabilityRule){
        throw new AppError(ERROR_MESSAGES.AVAILABILITY_RULE_NOT_FOUND,AppErrorCodes.NOT_FOUND)
       }
        if(availabilityRule?.psychologist.toString()!== dto.psychId){
           throw new AppError(ERROR_MESSAGES.UNAUTHORISED_ACTION,AppErrorCodes.FORBIDDEN_ERROR)  
        }
       const deletedAvailabilityRule =await this._availabilityRuleRepository.deleteById(dto.availabilityRuleId);
      
    }
}