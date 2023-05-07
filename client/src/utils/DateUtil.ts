import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import restInformation from "../restInformation/restInformation.json";

dayjs.extend(utc);

interface HolidaysData {
  [year: string]: {
    [date: string]: string;
  };
}

export function now() {
  return dayjs().utc();
}

export function nowFormat(format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs().utc().format(format);
}

export function dateFormat(value: string) {
  return dayjs(value).format();
}

export function parseUnixTimestamp(unixTimestamp: number) {
  return dayjs(unixTimestamp).unix();
}

export function isHoliday(value: string) {
  const year = value.slice(0, 4);
  const holidaysData: HolidaysData = restInformation;
  const day = dayjs(value).day();
  if (day === 0 || day === 6) {
    return true;
  }
  if (holidaysData[year][value]) {
    return true;
  }
  return false;
}

// string 시작일, 종료일 넣으면 Day Diff 리턴
