import { db } from "../models/index.js";

// 사용자의 모든 휴가유형을 찾는다.
const getUserAllVacations = async (userId) => {
  const userAllVacations = await db.Vacation.findAll({
    where: {
      user_id: userId
    }
  });
  return userAllVacations;
};

// 하나의 휴가유형을 찾는다.
const getUserVacationByPK = async (vacationId) => {
  const vacation = await db.Vacation.findByPk(vacationId, {
    include: {
      model: db.User
    }
  });
  return vacation;
};

export { getUserAllVacations, getUserVacationByPK }
