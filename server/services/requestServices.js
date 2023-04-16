// 중복 요청이 있으면 false를 리턴하는 함수
import { db } from "../models/index.js";
import checkDuplicateUsingType from "../functions/compareUsingType.js";


const checkDuplicateRequest = async (userId, vacationId, request) => {
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

const getDetailRequest = async (requestId) => {
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

  const {id, use_date, status, created_at, user, vacation} = request;

  const result = {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,

    vacationId: vacation.id,
    vacationName: vacation.name,

    useDate: use_date,
    status,

    createdAt: created_at,
    approvedInfo: approved_by === null ? null : {}


  };


  // 입맛에 맞게 변형해서 리턴해줄 것

  return request;
};


export { checkDuplicateRequest, getDetailRequest }
