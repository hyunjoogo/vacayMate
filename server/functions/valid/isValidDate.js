import dayjs from "dayjs";
import { YYYYMMDD } from "../../const/dateFormat.js";

/**
 * dayjs 라이브러리를 사용하여 지정된 형식에 맞는 유효한 날짜 문자열인지 확인합니다.
 * @param {string} date - 검증할 날짜 문자열입니다.
 * @param {string} [format='YYYYMMDD'] - 검증할 날짜 문자열의 형식입니다. 기본 형식은 'YYYYMMDD'입니다.
 * @returns {boolean} 지정된 형식에 맞는 유효한 날짜 문자열이면 true, 그렇지 않으면 false를 반환합니다.
 */

export const isValidDate = (date, format = YYYYMMDD) => {
  // dayjs 객체 생성
  const dayjsDate = dayjs(date, format, true);

  // dayjs 객체가 유효한 날짜를 가지고 있는지 확인
  const isValid = dayjsDate.isValid();

  // dayjs 객체가 YYYY-MM-DD 형식을 가지고 있는지 확인
  const isFormatted = dayjsDate.format(format) === date;

  return isValid && isFormatted;
}
