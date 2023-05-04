import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

// Locale이 적용된 시간
// 2022-05-01T00:00:00+09:00
export function dateFormat(value: string) {
  return dayjs(value).format();
}

export function parseUnixTimestamp(unixTimestamp: number) {
  return dayjs(unixTimestamp).unix();
}
