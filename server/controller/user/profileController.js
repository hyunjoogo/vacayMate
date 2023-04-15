import { db } from "../../models/index.js";
import handleError from "../../exceptions/error-handler.js";

const getProfile = async (req, res) => {
  const {id: userId} = req.user;
  try {
    const user = await db.User.findByPk(userId);
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
}

export { getProfile }

