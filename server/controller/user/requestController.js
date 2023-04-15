const handleError = require("../../exceptions/error-handler");
const VacationServices = require("../../services/vacationServices");
const validationError = require("../../exceptions/validation-error");
const isPossibleUsingType = require("../../functions/compareUsingType");
const dayjs = require('dayjs');
const RequestServices = require("../../services/requestServices");
const DateFormat = require("../../const/dateFormat");
const snakecaseKeys = require('snakecase-keys');
const db = require("../../models");


exports.getRequest = async (req, res) => {
  const {id: userId} = req.user;
  try {
    const user = await db.Request.findAll({where: {user_id: userId}});
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

exports.createRequests = async (req, res) => {
  const {id: userId} = req.user;
  const {requests, totalDays, vacationId} = req.body;
  const today = dayjs().format(DateFormat.YYYYMMDD);

  try {
    // 신청한 휴가유형에 문제가 있는지 확인
    const user = await db.User.findByPk(userId);
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

exports.getDetailRequest = async (req, res) => {
  const {requestId} = req.params;

  try {
    const request = await RequestServices.getDetailRequest(requestId);
    res.status(200).json(request);

  } catch (error) {
    handleError(res, error);
  }
};
