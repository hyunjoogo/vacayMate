import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

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
