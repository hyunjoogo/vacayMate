import { db } from "../models/index.js";
import { Sequelize } from "sequelize";
import { ROLE_TYPE } from "../const/admin.js";
import { CustomError } from "../exceptions/CustomError.js";
import dayjs from "dayjs";

const getMembersListPagination = async ({
  nowPage,
  pageSize,
  name,
  email,
  role,
  isLeave,
}) => {
  const offset = nowPage * pageSize;
  const limit = Number(pageSize);

  const where = {};
  let searchName = "";
  if (name) {
    searchName = name;
    where["$user.name$"] = { [Sequelize.Op.like]: `%${searchName}%` };
  }
  if (email) {
    where.email = { [Sequelize.Op.like]: `%${email}%` };
  }
  if (ROLE_TYPE.includes(role)) {
    where.role = role;
  }
  if (isLeave === "true" || isLeave === "false") {
    where.is_leave = isLeave === "true";
  }
  const { count, rows } = await db.User.findAndCountAll({
    where,
    order: [
      ["enter_date", "ASC"],
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

const getMemberDetail = async (memberNo) => {
  const result = await db.User.findOne({
    where: { id: memberNo },
    include: [
      {
        model: db.Vacation,
      },
      {
        model: db.Request,
        as: "user", // Update the alias to 'requests'
        separate: true, // Add separate: true to perform the query separately
        where: { user_id: memberNo }, // Add a where condition to filter based on the user_id
      },
    ],
  });

  return result;
};

const getMemberProfileWithVacation = async (memberNo) => {
  const result = await db.User.findOne({
    where: { id: memberNo },
    include: {
      model: db.Vacation,
    },
  });

  if (result === null) {
    throw new CustomError(400, "존재하지 않은 사용자입니다.");
  }
  return result;
};

const addMemberEnterDate = async (memberNo, enterDate, transaction) => {
  const memberWithVacation = await getMemberProfileWithVacation(memberNo);
  // 입사날짜가 이미 입력되어 있는 경우
  if (memberWithVacation.enter_date !== null) {
    throw new CustomError(400, "이미 입사날짜가 입력되어 있습니다.");
  }
  // 이미 연차가 생성되어 있는 경우
  if (
    memberWithVacation.Vacations.some((vacation) => vacation.type === "연차")
  ) {
    throw new CustomError(400, "이미 생성된 연차가 존재합니다.");
  }
  const result = await memberWithVacation.update(
    { enter_date: dayjs(enterDate).utc() },
    { transaction, returning: true }
  );
  return result;
};

export {
  getMemberDetail,
  getMembersListPagination,
  getMemberProfileWithVacation,
  addMemberEnterDate,
};
