import AvailabilityRule from "../../domain/entities/availability-rule.entity.js";
import QuickSlot from "../../domain/entities/quick-slot.entity.js";
import Session from "../../domain/entities/session.entity.js";
import SpecialDay from "../../domain/entities/special-day.entity.js";
import { SpecialDayType } from "../../domain/enums/SpecialDayType.js";
import { isoToHHMM } from "../../utils/timeConverter.js";
import { ERROR_MESSAGES } from "../constants/error-messages.constants.js";
import { AppErrorCodes } from "../error/app-error-codes.js";
import AppError from "../error/AppError.js";
import { filterUnbookedSlots } from "./filterUnbookedSlots.js";
import { Availability, generateSlots } from "./generateSlots.js";

export function getAvailableSlotsForDatePsych(
  specialDay: SpecialDay | null,
  availabilityRules: AvailabilityRule[],
  quickSlots: QuickSlot[],
  sessions: Session[]
) {
  let availability: Availability | null = null;
  if (availabilityRules.length === 0) {
    throw new AppError(
      ERROR_MESSAGES.AVAILABILITY_NOT_SET,
      AppErrorCodes.INVALID_INPUT
    );
  }
  const allSlots: { startTime: string; endTime: string }[] = [];
  if (specialDay) {
    if (specialDay.type === SpecialDayType.OVERRIDE) {
      availability = {
        startTime: isoToHHMM(specialDay.startTime!.toISOString()),
        endTime: isoToHHMM(specialDay.endTime!.toISOString()),
        durationInMins: specialDay.durationInMins!,
        bufferTimeInMins: specialDay.bufferTimeInMins!,
      };
    } else if (specialDay.type === SpecialDayType.ABSENT) {
      availability = null;
    }
    const availabilitySlots = generateSlots(availability);
    allSlots.push(...availabilitySlots);
  } else if (availabilityRules.length > 0) {
    for (const availabilityRule of availabilityRules as AvailabilityRule[]) {
      availability = {
        startTime: availabilityRule.startTime,
        endTime: availabilityRule.endTime,
        durationInMins: availabilityRule.durationInMins,
        bufferTimeInMins: availabilityRule.bufferTimeInMins,
      };
      const slotsGenerated = generateSlots(availability);
      allSlots.push(...slotsGenerated);
    }
  }

  if (quickSlots?.length) {
    for (const qs of quickSlots as QuickSlot[]) {
      const qsAvailability: Availability = {
        startTime: isoToHHMM(qs.startTime.toISOString()),
        endTime: isoToHHMM(qs.endTime.toISOString()),
        durationInMins: qs.durationInMins,
        bufferTimeInMins: qs.bufferTimeInMins,
      };
      const quickSlotsGenerated = generateSlots(qsAvailability);
      allSlots.push(...quickSlotsGenerated);
    }
  }
  const filteredSlots = filterUnbookedSlots(allSlots, sessions);
  return filteredSlots;
}
