const db = require('../../models/index');
const handleError = require("../../exceptions/error-handler");
const VacationServices = require('../../services/vacationServices');

exports.getVacations = async (req, res) => {
  const {id : userId} = req.user;
  try {
    const vacations = await VacationServices.getUserAllVacations(userId);
    res.status(200).json(vacations);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getDetailVacation = async (req, res) => {
  const {vacationId} = req.params;

  try {
    const vacation = await VacationServices.getUserVacationByPK(vacationId);
    res.status(200).json(vacation);
  } catch (error) {
    handleError(res, error);
  }
};
