// 중복 요청이 있으면 false를 리턴하는 함수
import { db } from "../models/index.js";
import checkDuplicateUsingType from "../functions/compareUsingType.js";
import { Sequelize } from "sequelize";
import { YYYYMMDD } from "../const/dateFormat.js";
import dayjs from "dayjs";
import { APPROVED, PENDING } from "../const/request-status.js";

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
  if (request === null) {
    return null;
  }
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
  return result;
};

const cancelRequest = async (requestId) => {
};

const getRequestsList = async ({nowPage = 1, pageSize = 10, name, usingType, status, startDate, endDate, userId}) => {
  const offset = (nowPage - 1) * pageSize;
  const limit = Number(pageSize);

  const where = {};
  let searchName = '';
  if (name) {
    searchName = name;
    where['$user.name$'] = {[Sequelize.Op.like]: `%${searchName}%`};
  }
  if (usingType) {
    console.log(usingType);
    where.using_type = usingType;
  }
  if (status) {
    console.log(status);
    where.status = status;
  }
  if (startDate === undefined && endDate === undefined) {
    const today = dayjs();
    const start = today.subtract(1, 'month').format(YYYYMMDD);
    const end = today.add(1, 'month').format(YYYYMMDD);
    where.use_date = {[Sequelize.Op.between]: [start, end]};
  } else {
    const start = startDate ? dayjs(startDate) : dayjs(endDate).subtract(1, 'month');
    const end = endDate ? dayjs(endDate) : dayjs(startDate).add(1, 'month');
    where.use_date = {[Sequelize.Op.between]: [start.format(YYYYMMDD), end.format(YYYYMMDD)]};
  }

  const {count, rows} = await db.Request.findAndCountAll({
    include: {
      model: db.User,
      as: 'user',
    },
    where,
    order: [['use_date', 'ASC'], ['created_at', 'ASC']],
    offset,
    limit
  });
  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,
    page: {
      nowPage: Number(nowPage),
      pageSize: limit,
      totalPages: totalPages,
      totalCount: count
    }
  };
};

const approveRequest = async (requestId, userId) => {

  /* FLOW 요청 승인하기
  1. 요청을 가지고 온다.
  2. 가지고 온 요청의 상태가 pending 일때만 승인을 할 수 있다. approved, canceled, refused 는 불가
  3. 승인을 하면 요청의 상태를 approved로 변경하고 승인일시, 승인자를 넣어준다.
 */

  const transaction = await db.sequelize.transaction();

  try {
    const request = await db.Request.findByPk(requestId);

    if (request.status !== PENDING) {
      throw {errorCode: 400, message: "대기 상태일때만 가능합니다."};
    }

    const approvedRequest = await request.update(
      {
        status: APPROVED,
        approved_by: userId,
        approved_at: dayjs.utc(),
      },
      {transaction}
    );

    await transaction.commit();

    return approvedRequest;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export { checkDuplicateRequest, getDetailRequest, getRequestsList, approveRequest };
