import { CustomError } from "../../exceptions/CustomError.js";
import { REQUEST_STATUS_LIST } from "../../const/request-status.js";
import { USING_TYPE_LIST } from "../../const/vacation-using-type.js";
import { isValidDate } from "../../functions/valid/isValidDate.js";

export const validateQuery = ({startDate, endDate, name, status, usingType}) => {
  if (startDate && isValidDate(startDate) === false) {
    throw new CustomError(400, "검색 시작일을 YYYY-MM-DD에 맞춰주세요.");
  }
  if (endDate && isValidDate(endDate) === false) {
    throw new CustomError(400, "검색 종료일을 YYYY-MM-DD에 맞춰주세요.");
  }
// 이름이 두글자 이상인지 확인
  if (name && name.length < 2) {
    throw new CustomError(400, "이름을 두글자 이상 입력해주세요.");
  }
// 요청의 상태가 rule에 맞는지
  if (status && REQUEST_STATUS_LIST.includes(status) === false) {
    throw new CustomError(400, "잘못된 사용요청 상태입니다.");
  }
// 사용타입이 rule에 맞는지
  if (usingType && USING_TYPE_LIST.includes(usingType) === false) {
    throw new CustomError(400, "잘못된 요청 사용유형입니다.");
  }
};
