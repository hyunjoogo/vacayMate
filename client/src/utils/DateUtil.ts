import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

import restInformation from "../restInformation/restInformation.json";

dayjs.extend(utc);
dayjs.extend(updateLocale);
dayjs.extend(relativeTime);
dayjs.locale("ko");

interface HolidaysData {
  [year: string]: {
    [date: string]: string;
  };
}

export function now() {
  return dayjs().utc();
}

export function nowFormat(format = "YYYY-MM-DD") {
  return dayjs().format(format);
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

export function timeFromNow(date: dayjs.Dayjs | string) {
  if (typeof date === "string") {
    return dayjs(date).fromNow();
  }

  return date.fromNow();
}
