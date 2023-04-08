const UserVacation = require('../models/user-vacation');
const VacationRequest = require('../models/vacation-request');
const {Sequelize} = require("sequelize");
const generateVacationRequests = require("./requestVacation/generateVacationRequests");
const sequelize = require("../database");
const dayjs = require('dayjs');


// 휴가사용요청 생성
exports.createRequest = async (req, res) => {
  const {userId, vacationTypeId, useTimes, vacationTotalDays} = req.body;

  const {isWrong, vacationRequests, overlaps} = await generateVacationRequests(useTimes, userId, vacationTypeId);

  if (isWrong) {
    return res.status(400).json({overlaps, error: '휴가신청 기간에 오류가 있습니다.'});
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

// 휴가사용요청 승인 (pending 일때만 가능) -> approved
exports.approveVacationRequest = async (req, res) => {
  const {vacationRequestId} = req.params;
  const {status, adminId} = req.body;

  try {
    // 해당 vacationRequestId에 대한 요청이 존재하는지 확인
    const vacationRequest = await VacationRequest.findOne({where: {id: vacationRequestId}});
    if (!vacationRequest) {
      return res.status(404).json({message: '휴가사용요청이 존재하지 않습니다.'});
    }

    // 취소된 휴가 사용 요청인 경우 처리 불가
    if (vacationRequest.status !== 'pending') {
      return res.status(400).json({message: '대기중인 휴가사용요청만 처리할 수 있습니다.'});
    }

    // 요청 처리
    const dateNow = dayjs().utc().format();
    if (status === 'approved') {
      await VacationRequest.update(
        {
          status: 'approved',
          approvedAt: dateNow,
          approvedBy: adminId
        },
        {
          where: {id: vacationRequestId}
        }
      );
    } else {
      return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    // 처리 완료 메시지 반환
    return res.status(200).json({ message: '요청이 처리되었습니다.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: '서버 오류가 발생했습니다.'});
  }
};

// 거절 (pending 일때만 가능) -> refused
exports.refuseVacationRequest = async (req, res) => {
  const {vacationRequestId} = req.params;
  const {status, adminId} = req.body;

  try {
    // 해당 vacationRequestId에 대한 요청이 존재하는지 확인
    const vacationRequest = await VacationRequest.findOne({where: {id: vacationRequestId}});
    if (!vacationRequest) {
      return res.status(404).json({message: '휴가사용요청이 존재하지 않습니다.'});
    }

    // 취소된 휴가 사용 요청인 경우 처리 불가
    if (vacationRequest.status !== 'pending') {
      return res.status(400).json({message: '대기중인 휴가사용요청만 처리할 수 있습니다.'});
    }

    // 요청 처리
    const dateNow = dayjs().utc().format();
    if (status === 'refused') {
      await VacationRequest.update(
        {
          status: 'refused',
          canceledAy: dateNow,
          canceledBy: adminId
        },
        {
          where: {id: vacationRequestId}
        }
      );
      // 거절시 잔여일수 복원
      const vacation = await UserVacation.findOne({
        where: { userId: vacationRequest.userId, vacationTypeId: vacationRequest.vacationTypeId },
      });
      await UserVacation.update(
        { remainingDays: vacation.remainingDays + vacationRequest.totalVacationDays },
        { where: { id: vacation.id } }
      );
    } else {
      return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    // 처리 완료 메시지 반환
    return res.status(200).json({ message: '요청이 처리되었습니다.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: '서버 오류가 발생했습니다.'});
  }
};

// 취소 (approved 일때만 ) => canceled
exports.cancelVacationRequest = async (req, res) => {
  const {vacationRequestId} = req.params;
  const {status, adminId} = req.body;

  try {
    // 해당 vacationRequestId에 대한 요청이 존재하는지 확인
    const vacationRequest = await VacationRequest.findOne({where: {id: vacationRequestId}});
    if (!vacationRequest) {
      return res.status(404).json({message: '휴가사용요청이 존재하지 않습니다.'});
    }

    // 취소된 휴가 사용 요청인 경우 처리 불가
    if (vacationRequest.status !== 'approved') {
      return res.status(400).json({message: '승인된 휴가만 처리할 수 있습니다.'});
    }

    // 요청 처리
    const dateNow = dayjs().utc().format();
    if (status === 'canceled') {
      await VacationRequest.update(
        {
          status: 'canceled',
          canceledAt: dateNow,
          canceledBy: adminId
        },
        {
          where: {id: vacationRequestId}
        }
      );
      // 취소시 잔여일수 복원
      const vacation = await UserVacation.findOne({
        where: { userId: vacationRequest.userId, vacationTypeId: vacationRequest.vacationTypeId },
      });
      await UserVacation.update(
        { remainingDays: vacation.remainingDays + vacationRequest.totalVacationDays },
        { where: { id: vacation.id } }
      );
    } else {
      return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    // 처리 완료 메시지 반환
    return res.status(200).json({ message: '요청이 처리되었습니다.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: '서버 오류가 발생했습니다.'});
  }
};
