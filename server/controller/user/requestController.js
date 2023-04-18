import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';
import { db } from "../../models/index.js";
import handleError from "../../exceptions/error-handler.js";
import * as VacationServices from "../../services/vacationServices.js";
import * as RequestServices from "../../services/requestServices.js";
import { YYYYMMDD } from "../../const/dateFormat.js";
import snakecaseKeys from "snakecase-keys";
import { CustomError } from "../../exceptions/CustomError.js";

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
      throw new CustomError(400, "잘못된 휴가유형입니다.");
    }
    if (vacation.user_id !== userId) {
      throw new CustomError(400, "본인의 휴가유형이 아닙니다.");
    }
    if (vacation.left_days === 0) { // 전체 일수를 받으면 가능
      throw new CustomError(400, "신청가능한 휴가일수가 없습니다.");
    }
    if (vacation.left_days < totalDays) {
      throw new CustomError(400, "신청가능한 휴가일수가 부족합니다.");
    }
    if (dayjs(today).isAfter(vacation.expiration_date)) {
      throw new CustomError(400, "이미 만료된 휴가유형입니다.");
    }
    const expiredRequests = requests.filter(v => dayjs(v.useDate).isAfter(vacation.expiration_date));
    if (expiredRequests.length !== 0) {
      throw new CustomError(400, "신청한 날짜가 휴가유형의 만료일을 넘었습니다.");
    }

    for (const item of requests) {
      const isPossibleRequest = await RequestServices.checkDuplicateRequest(userId, vacationId, item);
      if (isPossibleRequest === false) {
        throw new CustomError(400, "이미 신청되어 있는 시간입니다.");
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
  try {
    const {requestId} = req.params;
    const request = await RequestServices.getDetailRequest(requestId);
    res.status(200).json(request);
  } catch (error) {
    handleError(res, error);
  }
};

const cancelRequest = async (req, res) => {
  try {
    const {id: userId} = req.user;
    const {requestId} = req.params;
    const {message} = req.body;

    const {canceledRequest, updateVacation} = await RequestServices.cancelRequest(requestId, userId, message);
    res.status(200).json({canceledRequest, updateVacation});
  } catch (error) {
    handleError(res, error);
  }
};

export { getRequest, createRequests, getDetailRequest, cancelRequest };
