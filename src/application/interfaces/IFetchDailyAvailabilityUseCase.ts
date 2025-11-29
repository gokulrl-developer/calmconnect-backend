import { AvailabilityRuleStatus } from "../../domain/enums/AvailabilityRuleStatus.js";
import { QuickSlotStatus } from "../../domain/enums/QuickSlotStatus.js";
import { SpecialDayStatus } from "../../domain/enums/SpecialDayStatus.js";
import { SpecialDayType } from "../../domain/enums/SpecialDayType.js";
import { FetchDailyAvailabilityDTO } from "../dtos/psych.dto.js";

export interface DailyAvailabilityRule {
  startTime: string; //ISO string
  endTime: string; //ISO string
  durationInMins: number;
  bufferTimeInMins: number;
  status: AvailabilityRuleStatus;
  availabilityRuleId: string;
}

export interface DailySpecialDay {
  type:SpecialDayType;
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status: SpecialDayStatus;
  specialDayId: string;
}

export interface DailyQuickSlot {
  startTime: string;  // ISO string
  endTime: string;      //ISO string
  durationInMins: number; // slot duration
  bufferTimeInMins: number; 
  status: QuickSlotStatus;
  quickSlotId: string;
}
export interface DailyAvailability {
  availabilityRules: DailyAvailabilityRule[];
  specialDay?: DailySpecialDay;
  quickSlots: DailyQuickSlot[];
}
export default interface IFetchDailyAvailabilityUseCase {
  execute(dto: FetchDailyAvailabilityDTO): Promise<DailyAvailability>;
}
