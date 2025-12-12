import { AvailabilityRuleStatus } from "../enums/AvailabilityRuleStatus.js";

export default class AvailabilityRule {
  constructor(
    public psychologist: string,
    public weekDay: number,          // 0-6 0 = Sunday, 1 = Monday, ...
    public startTime: string,        // "09:00" (time-only)
    public endTime: string,          // "17:00"
    public durationInMins: number,   // slot duration
    public bufferTimeInMins: number = 0, // optional buffer
    public status:AvailabilityRuleStatus=AvailabilityRuleStatus.ACTIVE,
    public id?: string
  ) {}
}