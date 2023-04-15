const checkDuplicateUsingType = require("../functions/compareUsingType");
const validationError = require("../exceptions/validation-error");
const db = require('../models/index');

// 중복 요청이 있으면 false를 리턴하는 함수
exports.checkDuplicateRequest = async (userId, vacationId, request) => {
  const {useDate, usingType} = request;

  // 같은 날짜의 요청 가지고 오기
  const sameUseDateRequests = await db.Request.findAll(
    {
      where: {
        user_id: userId,
        use_date: useDate
      }
    }
  );
  if (sameUseDateRequests.length !== 0) {
    // 신청한 사용타입과 겹치는지 확인
    const isPossible = checkDuplicateUsingType(sameUseDateRequests, usingType);
    if (isPossible === false) {
      return false;
    }
  }
  return true;
};

exports.getDetailRequest = async (requestId) => {
  const request = await db.Request.findByPk(requestId, {
    include: [
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      },
      {
        model: db.Vacation,
        as: 'vacation',
        attributes: ['id', 'left_days', 'total_days']
      },
      {
        model: db.User,
        as: 'approvedBy',
        attributes: ['id', 'name', 'email']
      },
      {
        model: db.User,
        as: 'refusedBy',
        attributes: ['id', 'name', 'email']
      },
      {
        model: db.User,
        as: 'canceledBy',
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  const {id, use_date, status, created_at,user, vacation} = request;

  const result = {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,

    vacationId: vacation.id,
    vacationName: vacation.name,

    useDate : use_date,
    status,

    createdAt : created_at,
    approvedInfo : approved_by === null ? null : {

    }


  };

  //   const result = {
//     id, userId,
//     userName: user.name,
//
//     vacationTypeId : vacationType.id,
//     vacationTypeName : vacationType.name,
//
//     vacationStartDate: vacationStartDate,
//     vacationEndDate: vacationEndDate,
//     vacationTimeType: vacationTimeType,
//     totalVacationDays: totalVacationDays,
//
//     status,
//     isApproved: !!approvedByUser,
//     approvedByUserName: approvedByUser ? approvedByUser.name : null,
//     approvedByUserId: approvedByUser ? approvedByUser.id : null,
//     approvedAt: approvedByUser ? approvedAt : null,
//     isRefused: !!refusedByUser,
//     refusedByUserName: refusedByUser ? refusedByUser.name : null,
//     refusedByUserId: refusedByUser ? refusedByUser.id : null,
//     refusedAt: refusedByUser ? refusedAt : null,
//     isCanceled: !!canceledByUser,
//     canceledByUserName: canceledByUser ? canceledByUser.name : null,
//     canceledByUserId: canceledByUser ? canceledByUser.id : null,
//     canceledAt: canceledByUser ? canceledAt : null,
//   };

  // 입맛에 맞게 변형해서 리턴해줄 것

  return request;
};
