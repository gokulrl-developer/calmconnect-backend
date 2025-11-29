import {
  CreateAvaialabilityRuleDTO,
  EditAvaialabilityRuleDTO,
} from "../dtos/psych.dto.js";
import AvailabilityRule from "../../domain/entities/availability-rule.entity.js";
import { HHMMToIso } from "../../utils/timeConverter.js";
import { AvailabilityRuleSummary } from "../interfaces/IListAvailabilityRulesUseCase.js";
import { AvailabilityRuleStatus } from "../../domain/enums/AvailabilityRuleStatus.js";

export const mapCreateAvailabilityRuleDTOToDomain = (
  dto: CreateAvaialabilityRuleDTO
) => {
  return new AvailabilityRule(
    dto.psychId,
    dto.weekDay,
    dto.startTime,
    dto.endTime,
    dto.durationInMins,
    dto.bufferTimeInMins ?? 0,
    AvailabilityRuleStatus.ACTIVE,
    undefined
  );
};

export const mapEditAvailabilityRuleDTOToDomain = (
  dto: EditAvaialabilityRuleDTO,
  rule: AvailabilityRule
) => {
  return new AvailabilityRule(
    dto.psychId,
    rule.weekDay,
    dto.startTime ?? rule.startTime,
    dto.endTime ?? rule.endTime,
    dto.durationInMins ?? rule.durationInMins,
    dto.bufferTimeInMins ?? rule.bufferTimeInMins,
    dto.status ?? rule.status,
    rule.id
  );
};


export const mapAvailabilityRulesToSummaries = (
  rules: AvailabilityRule[]
): AvailabilityRuleSummary[] => {
  return rules.map(rule => ({
    weekDay: rule.weekDay,
    availabilityRuleId: rule.id!
  }));
};

export const mapDomainToRuleDetailsResponse = (
  rule: AvailabilityRule
) => {
  return {
    weekDay: rule.weekDay,
    startTime: rule.startTime,
    endTime: rule.endTime,
    durationInMins: rule.durationInMins,
    bufferTimeInMins: rule.bufferTimeInMins,
    status: rule.status,
    availabilityRuleId: rule.id!,
  };
};

export const mapDomainToDailyAvailabilityRule=(rule:AvailabilityRule,date:Date)=>{
    return {
        startTime:HHMMToIso(rule.startTime,date),
        endTime:HHMMToIso(rule.endTime,date),
        durationInMins:rule.durationInMins,
        bufferTimeInMins:rule.bufferTimeInMins,
        status:rule.status,
        availabilityRuleId:rule.id!
    }
}
/* export const toAvailabilityRuleListResponse=(dto:AvailabilityRule)=>{
    return {
        availabilityRuleId:dto.id!,
        startDate:dto.startDate.toISOString(),
        endDate:dto.endDate.toISOString()
    }
} */
