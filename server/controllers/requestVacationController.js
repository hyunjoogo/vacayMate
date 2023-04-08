const UserVacation = require('../models/user-vacation');
const VacationRequest = require('../models/vacation-request');
const {Sequelize} = require("sequelize");
const generateVacationRequests = require("./requestVacation/generateVacationRequests");
const sequelize = require("../database");

exports.createRequest = async (req, res) => {
  const {userId, vacationTypeId, useTimes, vacationTotalDays} = req.body;

  const {isWrong, vacationRequests, overlaps} = await generateVacationRequests(useTimes, userId, vacationTypeId);

  if (isWrong) {
    return res.status(400).json({ overlaps, error: '휴가신청 기간에 오류가 있습니다.'});
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
    const transaction = await sequelize.transaction();

    const bulkRequests = await VacationRequest.bulkCreate(vacationRequests, {transaction});

    // // 사용자가 신청한 휴가유형의 잔여일 업데이트
    await UserVacation.update(
      {remainingDays: userVacation.remainingDays - vacationTotalDays},
      {
        where: {
          userId,
          vacationTypeId
        },
        transaction
      }
    );

    await transaction.commit();

    return res.status(200).json({message: 'Vacation requests successfully created.', data: {bulkRequests}});
  } catch (err) {
    console.error(err);

    if (transaction) {
      await transaction.rollback();
    }

    return res.status(500).json({error: 'Failed to create vacation request'});
  }
};


const userTime = [
  {startDt: "2023-03-02 09:00:00", endDt: "2023-03-02 12:00:00", useType: "오전반차"},
  {startDt: "2023-03-03 09:00:00", endDt: "2023-03-03 18:00:00", useType: "일차"},
  {startDt: "2023-03-04 13:00:00", endDt: "2023-03-04 18:00:00", useType: "오후반차"}
];

/*
이제 값이 시분초까지 들어올꺼야.
const userTime = [
  {startDt: "2023-03-02 09:00:00", endDt: "2023-03-02 12:00:00"},
  {startDt: "2023-03-03 09:00:00", endDt: "2023-03-03 18:00:00"},
  {startDt: "2023-03-04 13:00:00", endDt: "2023-03-04 18:00:00"}
];

이것을 왜 이렇게 하냐면 겹치는 휴가를 막기 위해 하는거야.
09시~ 12시, 13시 ~ 18시, 09~18시 이렇게 입력이 될꺼야.
그런데 신청되어 있는 휴가의 시간이 09~18시일 때는 09시~ 12시, 13시 ~ 18시는 안되
13시 ~ 18시일 때는 09시~ 12시되고  13시 ~ 18시, 09~18시 안되
09시~ 12시일 대는 13시 ~ 18시되고  09시~ 12시, 09~18시 안되


예시 1)
신청되어 있는 휴가
const userTime = [
  {startDt: "2023-03-02 13:00:00", endDt: "2023-03-02 18:00:00", useType: "오후반차"},
];

새로 신청하는 휴가
1.   {startDt: "2023-03-02 13:00:00", endDt: "2023-03-02 18:00:00", useType: "오후반차"}
오류 이유 : 동일한 시간을 입력
2.  {startDt: "2023-03-02 09:00:00", endDt: "2023-03-02 18:00:00", useType: "일차"}
오류 이유 : 13시~ 18시를 포함하는 시간을 입력함

이해했어?
 */
