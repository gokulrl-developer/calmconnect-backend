import AvailabilityRule from "../../domain/entities/availability-rule.entity";
import QuickSlot from "../../domain/entities/quick-slot.entity";
import Session from "../../domain/entities/session.entity";
import SpecialDay from "../../domain/entities/special-day.entity";
import { isoToHHMM } from "../../utils/timeConverter";
import { ERROR_MESSAGES } from "../constants/error-messages.constants";
import { AppErrorCodes } from "../error/app-error-codes";
import AppError from "../error/AppError";
import { filterUnbookedSlots } from "./filterUnbookedSlots";
import { Availability, generateSlots } from "./generateSlots";

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
  let allSlots: { startTime: string; endTime: string }[] = [];
  if (specialDay) {
    if (specialDay.type === "override") {
      availability = {
        startTime: isoToHHMM(specialDay.startTime!.toISOString()),
        endTime: isoToHHMM(specialDay.endTime!.toISOString()),
        durationInMins: specialDay.durationInMins!,
        bufferTimeInMins: specialDay.bufferTimeInMins!,
      };
    } else if (specialDay.type === "absent") {
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
