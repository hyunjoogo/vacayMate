import handleError from "../../exceptions/error-handler.js";
import * as RequestServices from "../../services/requestServices.js";
import { isValidDateFormat } from "../../functions/isValidDateFormat.js";
import validationError from "../../exceptions/validation-error.js";
import { APPROVED, REQUEST_STATUS_LIST } from "../../const/request-status.js";
import { USING_TYPE_LIST } from "../../const/vacation-using-type.js";
import { db } from "../../models/index.js";
import dayjs from "dayjs";

const getRequestsList = async (req, res) => {
  const {id: userId} = req.user;
  const {nowPage = 1, pageSize = 10, name, usingType, status, startDate, endDate} = req.query;

  // 날짜 포맷이 맞는지 확인하는 로직
  if (startDate && isValidDateFormat(startDate) === false) {
    return validationError(res, "검색 시작일을 YYYY-MM-DD에 맞춰주세요.");
  }
  if (endDate && isValidDateFormat(endDate) === false) {
    return validationError(res, "검색 종료일을 YYYY-MM-DD에 맞춰주세요.");
  }
  // 이름이 두글자 이상인지 확인
  if (name && name.length < 2) {
    return validationError(res, "이름을 두글자 이상 입력해주세요.");
  }
  // 요청의 상태가 rule에 맞는지
  if (status && REQUEST_STATUS_LIST.includes(status) === false) {
    return validationError(res, "잘못된 사용요청 상태입니다.");
  }
  // 사용타입이 rule에 맞는지
  if (usingType && USING_TYPE_LIST.includes(usingType) === false) {
    return validationError(res, "잘못된 요청 사용유형입니다.");
  }
  /* FLOW
  1. 검색조건 : 요청자 이름, 요청의 사용타입(일차, 오전반차, 오후반차), 요청의 상태
      - 이름 : 두글자 이상으로 제한
  2. 기간검색 : 사용일자 (startDate ~ endDate 사용일자를 가지는 요청들)
      - startDate가 없으면 endDate-1개월 ~ endDate
      - endDate가 없으면 startDate ~ startDate+1개월
      - 둘 다 없으면 today-1개월, today+1개월
   */

  try {
    const result = await RequestServices.getRequestsList({
      nowPage,
      pageSize,
      name,
      usingType,
      status,
      startDate,
      endDate,
      userId
    });
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

const getDetailRequest = async (req, res) => {
  try {
    const {requestId} = req.params;
    const result = await RequestServices.getDetailRequest(requestId);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

const approveRequest = async (req, res) => {
  try {
    const {requestId} = req.params;
    const {id: userId} = req.user;
    const approvedRequest = await RequestServices.approveRequest(requestId, userId);
    res.status(200).json(approvedRequest);
  } catch (error) {
    handleError(res, error);
  }

};

const refuseRequest = async (req, res) => {
  try {
    const {requestId} = req.params;
    const {id: userId} = req.user;
    const {refuseRequest, updateVacation} = await RequestServices.refuseRequest(requestId, userId);
    res.status(200).json({refuseRequest, updateVacation});
  } catch (error) {
    handleError(res, error);
  }
};

export { getRequestsList, getDetailRequest, approveRequest, refuseRequest };
