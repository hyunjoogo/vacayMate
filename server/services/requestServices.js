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
  console.log(requestId);
  const request = await db.Request.findByPk(requestId,
    {
      include: [ db.User, db.Vacation]
    }
  );

  // const user = await db.User.findByPk(request.user_id);


  // 사용자 정보

  // 휴가유형 정보

  // approved

  // refused

  // canceled

  // created = appending


  return request;
};
