import { db } from "../models/index.js";
import { Sequelize } from "sequelize";
import { ROLE_TYPE } from "../const/admin.js";

const getMembersListPagination = async ({nowPage = 1, pageSize = 10, name, email, role, isLeave}) => {
  const offset = (nowPage - 1) * pageSize;
  const limit = Number(pageSize);

  const where = {};
  if (name) {
    where.name = {[Sequelize.Op.like]: `%${name}%`};
  }
  if (email) {
    where.email = {[Sequelize.Op.like]: `%${email}%`};
  }
  if (ROLE_TYPE.includes(role)) {
    where.role = role;
  }
  if (isLeave === 'true' || isLeave === 'false') {
    where.is_leave = isLeave === 'true';
  }
  const {count, rows} = await db.User.findAndCountAll({
    where,
    order: [['enter_date', 'ASC'], ['created_at', 'ASC']],
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

const getMemberDetail = async (memberNo) => {
  const result = await db.User.findOne({
    where: {id: memberNo},
    include: [
      {
        model: db.Vacation,
      },
      {
        model: db.Request,
        as: 'user', // Update the alias to 'requests'
        separate: true, // Add separate: true to perform the query separately
        where: { user_id: memberNo }, // Add a where condition to filter based on the user_id
      },
    ],
  });

  return result;
};

export { getMemberDetail, getMembersListPagination };
