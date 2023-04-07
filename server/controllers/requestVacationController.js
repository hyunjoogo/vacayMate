const UserVacation = require('../models/user-vacation');
const VacationRequest = require('../models/vacation-request');
const {Sequelize} = require("sequelize");
const generateVacationRequests = require("./requestVacation/generateVacationRequests");

exports.createRequest = async (req, res) => {
  const {userId, vacationTypeId, useTimes, vacationTotalDays} = req.body;

  const {isWrong, vacationRequests} = generateVacationRequests(useTimes, userId, vacationTypeId);

  if (isWrong) {
    return res.status(400).json({error: '휴가신청 기간에 오류가 있습니다.'});
  }

  try {
    // 해당 유저의 유효한 휴가 타입 가져오기
    const userVacation = await UserVacation.findOne({
      where: {
        userId,
        vacationTypeId,
        remainingDays: {
          [Sequelize.Op.gt]: 0,
          [Sequelize.Op.gte]: vacationTotalDays // ~ 이상
        },
        expirationDate: {
          [Sequelize.Op.gte]: new Date()
        }
      }
    });

    // 잔여 휴가일이 없으면 요청 불가
    if (!userVacation) {
      return res.status(400).json({error: '해당 휴가의 잔여 휴가일이 없습니다.'});
    }

    // 휴가 요청 생성
    const bulkRequests = await VacationRequest.bulkCreate(vacationRequests);

    return res.status(200).json({message: 'Vacation requests successfully created.', data: {bulkRequests}});
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: 'Failed to create vacation request'});
  }
};


const userTime = [
  {startDt: "2023-03-02", endDt: "2023-03-02", useType: "일차"},
  {startDt: "2023-03-03", endDt: "2023-03-03", useType: "일차"},
  {startDt: "2023-03-03", endDt: "2023-03-03", useType: "일차"}
];
