import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';
import { db } from "../../models/index.js";
import handleError from "../../exceptions/error-handler.js";
import * as RequestServices from "../../services/requestServices.js";

dayjs.extend(utc);


const getRequest = async (req, res) => {
  const {id: userId} = req.user;
  try {
    const user = await db.Request.findAll({where: {user_id: userId}});
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

const createRequests = async (req, res) => {
  const {id: userId} = req.user;
  const {requests, totalDays, vacationId} = req.body;

  const transaction = await db.sequelize.transaction();

  try {
    const result = await RequestServices.createRequests({requests, userId, totalDays, vacationId}, transaction);
    await transaction.commit();
    res.status(200).json(result);
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

const getDetailRequest = async (req, res) => {
  try {
    const {requestId} = req.params;
    const request = await RequestServices.getDetailRequest(requestId);
    res.status(200).json(request);
  } catch (error) {
    handleError(res, error);
  }
};

const cancelRequest = async (req, res) => {
  try {
    const {id: userId} = req.user;
    const {requestId} = req.params;
    const {message} = req.body;

    const {canceledRequest, updateVacation} = await RequestServices.cancelRequest(requestId, userId, message);
    res.status(200).json({canceledRequest, updateVacation});
  } catch (error) {
    handleError(res, error);
  }
};

export { getRequest, createRequests, getDetailRequest, cancelRequest };
