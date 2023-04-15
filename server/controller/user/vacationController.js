import * as VacationServices from "../../services/vacationServices.js";
import handleError from "../../exceptions/error-handler.js";

const getVacations = async (req, res) => {
  const {id: userId} = req.user;
  try {
    const vacations = await VacationServices.getUserAllVacations(userId);
    res.status(200).json(vacations);
  } catch (error) {
    handleError(res, error);
  }
};

const getDetailVacation = async (req, res) => {
  const {vacationId} = req.params;

  try {
    const vacation = await VacationServices.getUserVacationByPK(vacationId);
    res.status(200).json(vacation);
  } catch (error) {
    handleError(res, error);
  }
};

export { getVacations, getDetailVacation }
