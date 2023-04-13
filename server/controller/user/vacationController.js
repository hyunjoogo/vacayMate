const db = require('../models/index');
const handleError = require("../exceptions/error-handler");

exports.getVacations = async (req, res) => {
  const {userId} = req.params;

  try {
    const vacations = await db.Vacation.findAll({
      where: {
        user_id: userId
      }
    });

    res.status(200).json(vacations);
  } catch (error) {
    handleError(res, error);
  }

};
