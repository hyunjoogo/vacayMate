import { db } from "../models/index.js";
import checkDuplicateUsingType from "../functions/compareUsingType.js";
import { Sequelize } from "sequelize";
import { YYYYMMDD } from "../const/dateFormat.js";
import dayjs from "dayjs";
import {
  APPROVED,
  CANCELED,
  PENDING,
  REFUSED,
} from "../const/request-status.js";
import { CustomError } from "../exceptions/CustomError.js";
import * as VacationServices from "./vacationServices.js";
import snakecaseKeys from "snakecase-keys";

const getApprovedRequest = async (startDt, endDt) => {
  const approvedRequests = await db.Request.findAll({
    where: {
      // status: APPROVED,
      use_date: {
        [Sequelize.Op.between]: [startDt, endDt],
      },
    },
    include: {
      model: db.User,
      as: "user",
    },
  });

  const newApprovedRequests = approvedRequests.map((request) => {
    return {
      id: request.id,
      userId: request.user_id,
      userName: request.user.name,
      useDate: request.use_date,
      usingType: request.using_type,
    };
  });

  return newApprovedRequests;
};

const checkDuplicateRequest = async (userId, vacationId, request) => {
  const { useDate, usingType } = request;

  // 같은 날짜의 요청 가지고 오기
  const sameUseDateRequests = await db.Request.findAll({
    where: {
      user_id: userId,
      use_date: useDate,
    },
  });

  if (sameUseDateRequests.length !== 0) {
    // 신청한 사용타입과 겹치는지 확인
    const isPossible = checkDuplicateUsingType(sameUseDateRequests, usingType);
    if (isPossible === false) {
      return false;
    }
  }
  return true;
};

const createRequests = async (
  { requests: userRequests, userId, totalDays, vacationId },
  transaction
) => {
  const today = dayjs().format(YYYYMMDD);
  const vacation = await VacationServices.getUserVacationByPK(vacationId);

  if (!vacation) {
    throw new CustomError(400, "잘못된 휴가유형입니다.");
  }
  if (vacation.user_id !== userId) {
    throw new CustomError(400, "본인의 휴가유형이 아닙니다.");
  }
  if (vacation.left_days === 0) {
    throw new CustomError(400, "신청가능한 휴가일수가 없습니다.");
  }
  if (vacation.left_days < totalDays) {
    throw new CustomError(400, "신청가능한 휴가일수가 부족합니다.");
  }
  if (dayjs(today).isAfter(vacation.expiration_date)) {
    throw new CustomError(400, "This vacation type has already expired.");
  }
  const expiredRequests = userRequests.filter((request) =>
    dayjs(request.useDate).isAfter(vacation.expiration_date)
  );
  if (expiredRequests.length !== 0) {
    throw new CustomError(400, "신청한 날짜가 휴가유형의 만료일을 넘었습니다.");
  }

  for (const request of userRequests) {
    const isPossibleRequest = await checkDuplicateRequest(
      userId,
      vacationId,
      request
    );
    if (isPossibleRequest === false) {
      throw new CustomError(400, "이미 신청되어 있는 시간입니다.");
    }
  }

  const newRequestsForQuery = userRequests.map((request) =>
    snakecaseKeys({ ...request, vacationId, userId })
  );

  const newRequest = [];
  for (const item of newRequestsForQuery) {
    const request = await db.Request.create(item, { transaction });
    newRequest.push(request);
  }

  const updateVacation = await vacation.update(
    { left_days: vacation.left_days - totalDays },
    {
      transaction,
      returning: true,
    }
  );
  return updateVacation;
};

const getDetailRequest = async (requestId) => {
  const request = await db.Request.findByPk(requestId, {
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
      {
        model: db.Vacation,
        as: "vacation",
        attributes: ["id", "type", "left_days", "total_days"],
      },
      {
        model: db.User,
        as: "approvedBy",
        attributes: ["id", "name", "email"],
      },
      {
        model: db.User,
        as: "refusedBy",
        attributes: ["id", "name", "email"],
      },
      {
        model: db.User,
        as: "canceledBy",
        attributes: ["id", "name", "email"],
      },
    ],
  });
  if (request === null) {
    throw new CustomError(400, "존재하지 않는 휴가요청입니다.");
  }
  const {
    id,
    use_date,
    status,
    created_at,
    user,
    vacation,
    memo,
    approved_by,
    approvedBy,
    approved_at,
    approved_memo,
    canceled_by,
    canceledBy,
    canceled_at,
    canceled_memo,
    refused_by,
    refusedBy,
    refused_at,
    refused_memo,
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
      totalDays: vacation.total_days,
    },

    useDate: use_date,
    status,
    memo,

    createdAt: created_at,
    approvedInfo:
      approved_by === null
        ? null
        : {
            id: approvedBy.id,
            name: approvedBy.name,
            email: approvedBy.email,
            approvedAt: approved_at,
            approvedMemo: approved_memo,
          },
    canceledInfo:
      canceled_by === null
        ? null
        : {
            id: canceledBy.id,
            name: canceledBy.name,
            email: canceledBy.email,
            canceledAt: canceled_at,
            canceledMemo: canceled_memo,
          },
    refusedInfo:
      refused_by === null
        ? null
        : {
            id: refusedBy.id,
            name: refusedBy.name,
            email: refusedBy.email,
            refusedAt: refused_at,
            refusedMemo: refused_memo,
          },
  };
  return result;
};

const getRequestsList = async ({
  nowPage = 1,
  pageSize = 10,
  name,
  usingType,
  status,
  startDate,
  endDate,
}) => {
  const offset = (nowPage - 1) * pageSize;
  const limit = Number(pageSize);

  const where = {};
  let searchName = "";
  if (name) {
    searchName = name;
    where["$user.name$"] = { [Sequelize.Op.like]: `%${searchName}%` };
  }
  if (usingType) {
    where.using_type = usingType;
  }
  if (status) {
    where.status = status;
  }
  if (startDate === undefined && endDate === undefined) {
    const today = dayjs();
    const start = today.subtract(1, "month").format(YYYYMMDD);
    const end = today.add(1, "month").format(YYYYMMDD);
    where.use_date = { [Sequelize.Op.between]: [start, end] };
  } else {
    const start = startDate
      ? dayjs(startDate)
      : dayjs(endDate).subtract(1, "month");
    const end = endDate ? dayjs(endDate) : dayjs(startDate).add(1, "month");
    where.use_date = {
      [Sequelize.Op.between]: [start.format(YYYYMMDD), end.format(YYYYMMDD)],
    };
  }

  const { count, rows } = await db.Request.findAndCountAll({
    include: {
      model: db.User,
      as: "user",
    },
    where,
    order: [
      ["use_date", "ASC"],
      ["created_at", "ASC"],
    ],
    offset,
    limit,
  });
  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,
    page: {
      nowPage: Number(nowPage),
      pageSize: limit,
      totalPages: totalPages,
      totalCount: count,
    },
  };
};

const cancelRequest = async (requestId, userId, message) => {
  /* FLOW 요청 취소하기
1. 요청을 가지고 온다.
2. 가지고 온 요청의 상태가 pending, approved이면 취소를 할 수 있다. canceled, refused 는 불가
3. 취소를 하면 요청의 상태를 canceled로 변경하고 취소일시, 취소자를 넣어준다.
4. 그리고 요청의 vacation을 원복시킨다.
 */
  const transaction = await db.sequelize.transaction();
  try {
    // 요청 가지고 오기
    const request = await db.Request.findByPk(requestId);
    // 상태가 취소, 거절이면 취소할 수 없음
    if (request.status === CANCELED || request.status === REFUSED) {
      throw new CustomError(
        400,
        "취소되거나 거절된 휴가요청은 최소할 수 없습니다."
      );
    }
    // 요청 상태를 canceled로 변경, 취소일시, 취소자를 넣어준다.
    const canceledRequest = await request.update(
      {
        status: CANCELED,
        canceled_by: userId,
        canceled_at: dayjs.utc(),
        canceled_memo: message,
      },
      { transaction }
    );
    // 해당 요청의 vacation 사용한건 원복시키기
    const literal = db.Sequelize.literal(
      `\`left_days\` + ${request.using_day}`
    );
    await db.Vacation.update(
      { left_days: literal },
      {
        where: {
          id: request.vacation_id,
        },
        transaction,
      }
    );
    // 업데이트된 vacation 가지고 오기
    const updateVacation = await db.Vacation.findByPk(request.vacation_id, {
      transaction,
    });

    await transaction.commit();
    return { canceledRequest, updateVacation };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const approveRequest = async (requestId, userId, message) => {
  /* FLOW 요청 승인하기
  1. 요청을 가지고 온다.
  2. 가지고 온 요청의 상태가 pending 일때만 승인을 할 수 있다. approved, canceled, refused 는 불가
  3. 승인을 하면 요청의 상태를 approved로 변경하고 승인일시, 승인자를 넣어준다.
 */

  const transaction = await db.sequelize.transaction();
  try {
    const request = await db.Request.findByPk(requestId);
    if (request.status !== PENDING) {
      throw new CustomError(400, "대기 상태일때만 가능합니다.");
    }

    const approvedRequest = await request.update(
      {
        status: APPROVED,
        approved_by: userId,
        approved_at: dayjs.utc(),
        approved_memo: message,
      },
      { transaction }
    );

    await transaction.commit();
    return approvedRequest;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const refuseRequest = async (requestId, userId, message) => {
  /* FLOW 요청 승인하기
    1. 요청을 가지고 온다.
    2. 가지고 온 요청의 상태가 pending 일때만 승인을 할 수 있다. approved, canceled, refused 는 불가
    3. 승인을 하면 요청의 상태를 approved로 변경하고 승인일시, 승인자를 넣어준다.
    4. 그리고 요청의 vacation을 원복시킨다.
  */
  const transaction = await db.sequelize.transaction();

  try {
    const request = await db.Request.findByPk(requestId);

    if (request.status !== PENDING) {
      throw new CustomError(400, "대기 상태일때만 가능합니다.");
    }

    const refusedRequest = await request.update(
      {
        status: REFUSED,
        refused_by: userId,
        refused_at: dayjs.utc(),
        refused_memo: message,
      },
      { transaction }
    );

    const literal = db.Sequelize.literal(
      `\`left_days\` + ${request.using_day}`
    );
    await db.Vacation.update(
      { left_days: literal },
      {
        where: {
          id: request.vacation_id,
        },
        transaction,
      }
    );

    // 업데이트된 vacation 가지고 오기
    const updateVacation = await db.Vacation.findByPk(request.vacation_id, {
      transaction,
    });

    await transaction.commit();
    return { refusedRequest, updateVacation };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export {
  getApprovedRequest,
  checkDuplicateRequest,
  createRequests,
  getDetailRequest,
  getRequestsList,
  cancelRequest,
  approveRequest,
  refuseRequest,
};
