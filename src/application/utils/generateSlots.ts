import AvailabilityRule, {
  SpecialDay,
} from "../../domain/entities/availability-rule.entity";
import Holiday from "../../domain/entities/holiday.entity";
import { minutesToTimeString, timeStringToMinutes } from "../../utils/timeConverter";

export default function generateSlots(
  availabilityRule: AvailabilityRule | null,
  holiday: Holiday | null,
  date: Date
) {
  if (!availabilityRule) {
    return []
  }
  const weekDay = date.getDay();
  const startTime = timeStringToMinutes(availabilityRule.startTime);
  const endTime = timeStringToMinutes(availabilityRule.endTime);
  const { bufferTimeInMins, durationInMins } = availabilityRule;
  let availableSlots = []; // available Slots for a non-special day in availability rule
  let currTime = startTime;

  while (currTime < endTime) {
    let currStartTime = currTime;
    currTime += durationInMins;
    if (currTime < endTime) {
      const slot = {
        startTime: minutesToTimeString(currStartTime),
        quick: availabilityRule.quickSlots.includes(
          minutesToTimeString(currStartTime)
        )
          ? true
          : false,
        endTime: minutesToTimeString(currTime),
      };
      availableSlots.push(slot);
      currTime += bufferTimeInMins;
    }
  }

  const isSpecialDay = availabilityRule.specialDays.some(
    (day) => day.weekDay === weekDay
  );
  if (isSpecialDay === true) {
    const slotStartTimes = availabilityRule.specialDays.filter(
      (day) => day.weekDay === weekDay
    )[0].availableSlots;
    availableSlots = slotStartTimes.map((start: string) => {
      return {
        startTime: start,
        quick: availabilityRule.quickSlots.includes(start) ? true : false,
        endTime: minutesToTimeString(
          timeStringToMinutes(start) + durationInMins
        ),
      };
    });
  }
  if (holiday) {
    const slotStartTimes = holiday.availableSlots;
    availableSlots = slotStartTimes.map((start: string) => {
      return {
        startTime: start,
        quick: availabilityRule.quickSlots.includes(start) ? true : false,
        endTime: minutesToTimeString(
          timeStringToMinutes(start) + durationInMins
        ),
      };
    });
  }

  return availableSlots ;
}
