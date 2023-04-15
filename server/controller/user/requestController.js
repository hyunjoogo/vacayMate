const {Request, Vacation} = require('../../models/index');
const handleError = require("../../exceptions/error-handler");
const VacationServices = require("../../services/vacationServices");
const validationError = require("../../exceptions/validation-error");
const isPossibleUsingType = require("../../functions/compareUsingType");
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

exports.getRequest = async (req, res) => {
  const {id: userId} = req.user;
  try {
    const user = await Request.findAll({where: {user_id: userId}});
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

exports.createRequest = async (req, res) => {
  const {id: userId} = req.user;
  const {vacationId, useDate, usingType, memo} = req.body;

  try {
    // 신청한 휴가유형에 문제가 있는지 확인
    const vacation = await VacationServices.getUserVacationByPK(vacationId);
    if (vacation === null) {
      return validationError(res, "잘못된 휴가유형입니다.");
    }
    if (vacation.user_id !== userId) {
      return validationError(res, "본인의 휴가유형이 아닙니다.");
    }
    if (vacation.left_days === 0) {
      return validationError(res, "가능한 휴가일수가 없습니다.");
    }
    if (dayjs(useDate).isSameOrAfter(vacation.expiration_date)) {
      return validationError(res, "이미 만료된 휴가유형입니다.");
    }

    // 중복 휴가신청을 막는 코드
    // 같은 날짜의 요청 가지고 오기
    const sameUseDateRequests = await Request.findAll(
      {
        where: {
          user_id: userId,
          use_date: useDate
        }
      }
    );
    // 없으면 바로 입력
    if (sameUseDateRequests.length !== 0) {
      // 신청한 사용타입과 겹치는지 확인
      const isPossible = isPossibleUsingType(sameUseDateRequests, usingType);
      if (isPossible === false) {
        return validationError(res, "이미 신청되어 있는 시간입니다.");
      }
    }

    const newRequest = await Request.create({
      user_id: userId,
      vacation_id: vacationId,
      use_date: useDate,
      using_type: usingType,
      memo
    });

    res.status(200).json(newRequest);
  } catch (error) {
    handleError(res, error);
  }
};
