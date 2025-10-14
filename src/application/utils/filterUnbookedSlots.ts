import { HHMMToIso } from "../../utils/timeConverter";
import { Slot } from "./generateSlots";
import Session from "../../domain/entities/session.entity"; 

const isOverlapping = (slotStart: Date, slotEnd: Date, sessionStart: Date, sessionEnd: Date) => {
  return (
    (slotStart < sessionEnd && slotStart >= sessionStart) ||
    (slotEnd > sessionStart && slotEnd <= sessionEnd)
  );
};

export const filterUnbookedSlots = (
  slots: Slot[],
  sessions: Session[]
): Slot[] => {
  if (!slots?.length) return [];

  const filteredSlots: Slot[] = [];

  for (const slot of slots) {
    const slotDate = sessions[0]?.startTime ? new Date(sessions[0].startTime) : new Date();

    const slotStartISO = new Date(HHMMToIso(slot.startTime, slotDate));
    const slotEndISO = new Date(HHMMToIso(slot.endTime, slotDate));

    const hasOverlap = sessions.some((session) => {
      return isOverlapping(slotStartISO, slotEndISO, session.startTime, session.endTime);
    });

    if (!hasOverlap) {
      const formatHHMM = (d: Date) => d.toTimeString().slice(0, 5);
      filteredSlots.push({
        startTime: formatHHMM(slotStartISO),
        endTime: formatHHMM(slotEndISO),
      });
    }
  }

  return filteredSlots;
};
