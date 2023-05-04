import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function now() {
  return dayjs().utc();
}

export function dateFormat(value: string) {
  return dayjs(value).format();
}

export function parseUnixTimestamp(unixTimestamp: number) {
  return dayjs(unixTimestamp).unix();
}
