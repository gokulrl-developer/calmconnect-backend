import { CreateAvaialabilityRuleDTO } from "../dtos/psych.dto";
import AvailabilityRule from "../../domain/entities/availability-rule.entity";

export const toAvailabilityRuleDomain=(dto:CreateAvaialabilityRuleDTO)=>{
    return new AvailabilityRule(
   dto.psychId,
   dto.startTime,
   dto.endTime,
   new Date(dto.startDate),
   new Date(dto.endDate),
   dto.durationInMins??0,
   dto.bufferTimeInMins,
   dto.quickSlots,
   new Date(dto.slotsOpenTime),
   dto.specialDays,
   dto.quickSlotsReleaseWindowMins,
   undefined
    )
}

export const toAvailabilityRuleListResponse=(dto:AvailabilityRule)=>{
    return {
        availabilityRuleId:dto.id!,
        startDate:dto.startDate.toISOString(),
        endDate:dto.endDate.toISOString()
    }
}