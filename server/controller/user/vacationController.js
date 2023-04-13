const db = require('../../models/index');
const handleError = require("../../exceptions/error-handler");
const VacationServices = require('../../services/vacationServices');

exports.getVacations = async (req, res) => {
  const {userId} = req.params;
  try {
    const vacations = await VacationServices.getUserAllVacations(userId);
    res.status(200).json(vacations);
  } catch (error) {
    handleError(res, error);
  }
};
