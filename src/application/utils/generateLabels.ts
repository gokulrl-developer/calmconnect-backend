import { format, addDays, addMonths, addYears, isBefore, isSameDay, startOfMonth, startOfYear } from "date-fns";

export function generateLabels(
  startDate: Date,
  endDate: Date,
  interval: "day" | "month" | "year"
): string[] {
  const labels: string[] = [];
  let current = new Date(startDate);

  while (isBefore(current, endDate) || isSameDay(current, endDate)) {
    if (interval === "day") {
      labels.push(format(current, "yyyy-MM-dd"));
      current = addDays(current, 1);
    } else if (interval === "month") {
      labels.push(format(startOfMonth(current), "yyyy-MM"));
      current = addMonths(current, 1);
    } else if (interval === "year") {
      labels.push(format(startOfYear(current), "yyyy"));
      current = addYears(current, 1);
    }
  }

  return labels;
}
