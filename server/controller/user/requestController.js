const {Request, Vacation} = require('../../models/index');
const handleError = require("../../exceptions/error-handler");
const VacationServices = require("../../services/vacationServices");

exports.getRequest = async (req, res) => {
  const {id : userId} = req.user;
  try {
    const user = await Request.findAll({where : {user_id: userId}});
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
}

exports.createRequest = async (req, res) => {
  const {id : userId} = req.user;
  const {vacationId, useDate, usingType, memo} = req.body;

  try {
    // 사용자의 모든 휴가유형을 찾는다.
    const vacations = await VacationServices.getUserAllVacations(userId)
    // 휴가유형 자체가 없을 경우 Error
    if (vacations.length === 0) {
      return res.status(400).json({message: "본인의 휴가 유형이 없습니다."});
    }

    // 입력한 휴가유형이 본인 것이 아니면 Error
    // 엉뚱한 휴가유형이 입력된 경우도 걸러진다.
    const vacationIds = vacations.map(vacation => vacation.id);
    if (vacationIds.includes(vacationId) === false) {
      return res.status(400).json({message: "본인의 휴가 유형이 아닙니다."});
    }

    // 휴가요청 만드는 코드 작성해야함
    // const user = await Request.findAll({where : {user_id: userId}});
    // res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
}
