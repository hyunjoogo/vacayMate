import { db } from "../../models/index.js";
import handleError from "../../exceptions/error-handler.js";
import dayjs from "dayjs";
import * as VacationServices from "../../services/vacationServices.js";
import validationError from "../../exceptions/validation-error.js";
import * as RequestServices from "../../services/requestServices.js";
import { YYYYMMDD } from "../../const/dateFormat.js";

const getRequest = async (req, res) => {
  const {id: userId} = req.user;
  try {
    const user = await db.Request.findAll({where: {user_id: userId}});
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

const createRequests = async (req, res) => {
  const {id: userId} = req.user;
  const {requests, totalDays, vacationId} = req.body;
  const today = dayjs().format(YYYYMMDD);

  try {
    // 신청한 휴가유형에 문제가 있는지 확인
    const vacation = await VacationServices.getUserVacationByPK(vacationId);
    if (vacation === null) {
      return validationError(res, "잘못된 휴가유형입니다.");
    }
    if (vacation.user_id !== userId) {
      return validationError(res, "본인의 휴가유형이 아닙니다.");
    }
    if (vacation.left_days === 0) { // 전체 일수를 받으면 가능
      return validationError(res, "신청가능한 휴가일수가 없습니다.");
    }
    if (vacation.left_days < totalDays) {
      return validationError(res, "신청가능한 휴가일수가 부족합니다.");
    }
    if (dayjs(today).isAfter(vacation.expiration_date)) {
      return validationError(res, "이미 만료된 휴가유형입니다.");
    }
    const expiredRequests = requests.filter(v => dayjs(v.useDate).isAfter(vacation.expiration_date));
    if (expiredRequests.length !== 0) {
      return validationError(res, "신청한 날짜가 휴가유형의 만료일을 넘었습니다.");
    }

    for (const item of requests) {
      const isPossibleRequest = await RequestServices.checkDuplicateRequest(userId, vacationId, item);
      if (isPossibleRequest === false) {
        return validationError(res, "이미 신청되어 있는 시간입니다.");
      }
    }
    const newRequests = requests.map(request => snakecaseKeys({...request, vacationId, userId}));

    const newRequest = [];
    for (const item of newRequests) {
      const request = await vacation.createRequest(item);
      newRequest.push(request);
    }


    const updateVacation = await vacation.update({left_days: vacation.left_days - totalDays}, {returning: true});

    res.status(200).json({newRequest, updateVacation});
  } catch (error) {
    handleError(res, error);
  }
};

const getDetailRequest = async (req, res) => {
  const {requestId} = req.params;

  try {
    const request = await RequestServices.getDetailRequest(requestId);
    res.status(200).json(request);

  } catch (error) {
    handleError(res, error);
  }
};

const cancelRequest = async (req, res) => {
  const {requestId} = req.params;

  try {
    //
    /* FLOW 요청 취소하기
    1. 요청을 가지고 온다.
    2. 가지고 온 요청의 상태가 pending, approved이면 취소를 할 수 있다. canceled, refused 는 불가
    3. 취소를 하면 요청의 상태를 canceled로 변경하고 취소일시, 취소자를 넣어준다.
    4. 그리고 요청의 vacation을 원복시킨다.
    // 휴가요청시 using_type + using_day를 하나 만들어야겠다.
     */


    const request = await RequestServices.cancelRequest(requestId);
    res.status(200).json(request);

  } catch (error) {
    handleError(res, error);
  }
}

export { getRequest, createRequests, getDetailRequest, cancelRequest}
