import dayjs from "dayjs";
import { YYYYMMDD } from "../const/dateFormat.js";

export function isValidDateFormat(dateString) {
  return dayjs(dateString, YYYYMMDD, true).isValid();
}
