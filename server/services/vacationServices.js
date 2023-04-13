const db = require("../models");

exports.getUserAllVacations = async (userId) => {
  const userAllVacations = await db.Vacation.findAll({
    where: {
      user_id: userId
    }
  });
  return userAllVacations;
};
