// 중복 요청이 있으면 false를 리턴하는 함수
import { db } from "../models/index.js";
import checkDuplicateUsingType from "../functions/compareUsingType.js";
import camelCase from 'camelcase';

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
        attributes: ['id', 'type', 'left_days', 'total_days']
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

  const {
    id, use_date, status, created_at, user, vacation, memo,
    approved_by, approvedBy, approvedAt,
    canceled_by, canceledBy, canceledAt,
    refused_by, refusedBy, refusedAt
  } = request;

  const result = {
    id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,

    vacation: {
      id: vacation.id,
      type: vacation.type,
      leftDays: vacation.left_days,
      totalDays: vacation.total_days
    },

    useDate: use_date,
    status,
    memo,

    createdAt: created_at,
    approvedInfo: approved_by === null ? null : {
      id: approvedBy.id,
      name: approvedBy.name,
      email: approvedBy.email,
      approved_at: approvedAt
    },
    canceledInfo: canceled_by === null ? null : {
      id: canceledBy.id,
      name: canceledBy.name,
      email: canceledBy.email,
      canceled_at: canceledAt
    },
    refusedInfo: refused_by === null ? null : {
      id: refusedBy.id,
      name: refusedBy.name,
      email: refusedBy.email,
      refused_at: refusedAt
    },
  };


  // 입맛에 맞게 변형해서 리턴해줄 것

  return result;
};


export { checkDuplicateRequest, getDetailRequest }
