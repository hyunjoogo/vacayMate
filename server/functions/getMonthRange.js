import dayjs from "dayjs";

export function getMonthRange(year, month) {
  const startDate = dayjs(`${year}-${month}-01`).locale("en");

  // if the 1st day of the month is not Sunday, get the last Sunday of the previous month as start date
  if (startDate.day() !== 0) {
    startDate.subtract(startDate.day(), "day");
  }

  const endDate = dayjs(startDate).add(1, "month").subtract(1, "day");

  // if the last day of the month is not Saturday, get the first Saturday of the next month as end date
  if (endDate.day() !== 6) {
    endDate.add(6 - endDate.day(), "day");
  }

  return {
    start: startDate.format("MMM D"),
    end: endDate.format("MMM D"),
  };
}
console.log(getMonthRange(2023, 3));
