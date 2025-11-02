import { FetchDailyAvailabilityDTO } from "../dtos/psych.dto";

export interface DailyAvailabilityRule {
  startTime: string; //ISO string
  endTime: string; //ISO string
  durationInMins: number;
  bufferTimeInMins: number;
  status: "active" | "inactive";
  availabilityRuleId: string;
}

export interface DailySpecialDay {
  type: "override" | "absent";
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status: "active" | "inactive";
  specialDayId: string;
}

export interface DailyQuickSlot {
  startTime: string;  // ISO string
  endTime: string;      //ISO string
  durationInMins: number; // slot duration
  bufferTimeInMins: number; 
  status: "active" | "inactive";
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
