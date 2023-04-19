import handleError from "../../exceptions/error-handler.js";
import * as RequestServices from "../../services/requestServices.js";
import { validateQuery } from "../../services/validateQuery/validateQuery.js";

const getRequestsList = async (req, res) => {
  const {id: userId} = req.user;
  const {nowPage = 1, pageSize = 10, name, usingType, status, startDate, endDate} = req.query;

  validateQuery({startDate, endDate, name, status, usingType});

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
    const {message} = req.body;

    const approvedRequest = await RequestServices.approveRequest(requestId, userId, message);
    res.status(200).json(approvedRequest);
  } catch (error) {
    handleError(res, error);
  }

};

const refuseRequest = async (req, res) => {
  try {
    const {requestId} = req.params;
    const {id: userId} = req.user;
    const {message} = req.body;

    const {refusedRequest, updateVacation} = await RequestServices.refuseRequest(requestId, userId, message);
    res.status(200).json({refusedRequest, updateVacation});
  } catch (error) {
    handleError(res, error);
  }
};

export { getRequestsList, getDetailRequest, approveRequest, refuseRequest };
