import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';

import { db } from "../../models/index.js";
import handleError from "../../exceptions/error-handler.js";
import * as VacationServices from "../../services/vacationServices.js";
import validationError from "../../exceptions/validation-error.js";
import * as RequestServices from "../../services/requestServices.js";
import { YYYYMMDD } from "../../const/dateFormat.js";
import snakecaseKeys from "snakecase-keys";
import { CANCELED, REFUSED } from "../../const/request-status.js";

dayjs.extend(utc);


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

  const transaction = await db.sequelize.transaction();

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
      const request = await db.Request.create(item, {transaction});
      newRequest.push(request);
    }


    const updateVacation = await vacation.update({left_days: vacation.left_days - totalDays}, {
      transaction,
      returning: true
    });
    await transaction.commit();

    res.status(200).json({newRequest, updateVacation});
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

const getDetailRequest = async (req, res) => {
  const {requestId} = req.params;

  try {
    const request = await RequestServices.getDetailRequest(requestId);
    if (request === null) {
      return validationError(res, "존재하지 않는 휴가요청입니다.");
    }
    res.status(200).json(request);

  } catch (error) {
    handleError(res, error);
  }
};

const cancelRequest = async (req, res) => {
  const {id: userId} = req.user;
  const {requestId} = req.params;

  const transaction = await db.sequelize.transaction();

  try {
    // TODO 이걸 서비스로 어떻게 나누지?
    /* FLOW 요청 취소하기
    1. 요청을 가지고 온다.
    2. 가지고 온 요청의 상태가 pending, approved이면 취소를 할 수 있다. canceled, refused 는 불가
    3. 취소를 하면 요청의 상태를 canceled로 변경하고 취소일시, 취소자를 넣어준다.
    4. 그리고 요청의 vacation을 원복시킨다.
     */
    // 요청 가지고 오기
    const request = await db.Request.findByPk(requestId);
    // 상태가 취소, 거절이면 취소할 수 없음
    if (request.status === CANCELED || request.status === REFUSED) {
      return validationError(res, "취소되거나 거절된 휴가요청은 최소할 수 없습니다.")
    }
    // 요청 상태를 canceled로 변경, 취소일시, 취소자를 넣어준다.
    const canceledRequest = await request.update({
      status: CANCELED,
      canceled_by: userId,
      canceled_at: dayjs.utc()
    }, {transaction});

    // 해당 요청의 vacation 사용한건 원복시키기
    const literal = db.Sequelize.literal(`\`left_days\` + ${request.using_day}`);
    await db.Vacation.update(
      {left_days: literal},
      {
        where: {
          id: request.vacation_id
        },
        transaction,
      });

    // 업데이트된 vacation 가지고 오기
    const updateVacation = await db.Vacation.findByPk(request.vacation_id, {transaction});

    await transaction.commit();
    res.status(200).json({canceledRequest, updateVacation});
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export { getRequest, createRequests, getDetailRequest, cancelRequest };
