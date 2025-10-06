import { ListAvailabilityRulesDTO } from "../../dtos/psych.dto";
import IAvailabilityRuleRepository from "../../../domain/interfaces/IAvailabilityRuleRepository";
import IListAvailabilityRuleUseCase from "../../interfaces/IListAvailabilityRuleUseCase";
import { toAvailabilityRuleListResponse } from "../../mappers/AvailabilityRuleMapper";

export default class ListAvailabilityRuleUseCase implements IListAvailabilityRuleUseCase{
    constructor(
      private readonly _availabilityRuleRepository:IAvailabilityRuleRepository
    ){}
 async execute(dto:ListAvailabilityRulesDTO){
    const availabilityRules=await this._availabilityRuleRepository.findAllByPsychId(dto.psychId);
    const availabilityRuleSummaries=availabilityRules.map((rule)=>{
        return toAvailabilityRuleListResponse(rule)
    })
    return availabilityRuleSummaries
 }
}