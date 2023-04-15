const checkDuplicateUsingType = require("../functions/compareUsingType");
const validationError = require("../exceptions/validation-error");
const {Request} = require('../models/index');


exports.checkDuplicateRequest = async (userId, vacationId, request) => {
  const {useDate, usingType} = request;
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
    const isPossible = checkDuplicateUsingType(sameUseDateRequests, usingType);
    if (isPossible === false) {
      return false;
    }
  }
  return true;
};
