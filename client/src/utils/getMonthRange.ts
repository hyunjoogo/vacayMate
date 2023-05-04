import dayjs from "dayjs";

interface MonthRange {
  startDt: string;
  endDt: string;
}

export function getMonthRange(today: dayjs.Dayjs): MonthRange {
  let startDt = today.startOf("month");
  let endDt = today.endOf("month");

  if (startDt.day() !== 0) {
    startDt = startDt.subtract(startDt.day(), "day");
  }

  if (endDt.day() !== 6) {
    endDt = endDt.add(6 - endDt.day(), "day");
  }

  return {
    startDt: startDt.format(),
    endDt: endDt.format(),
  };
}
