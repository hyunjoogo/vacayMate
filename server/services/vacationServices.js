const db = require("../models");

// 사용자의 모든 휴가유형을 찾는다.
exports.getUserAllVacations = async (userId) => {
  const userAllVacations = await db.Vacation.findAll({
    where: {
      user_id: userId
    }
  });
  return userAllVacations;
};

// 하나의 휴가유형을 찾는다.
exports.getUserVacationByPK = async (vacationId) => {
  const vacation = await db.Vacation.findByPk(vacationId ,{
    include : {
      model: db.User
    }
  });
  return vacation;
};

