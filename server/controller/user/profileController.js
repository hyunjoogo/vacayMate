const db = require('../../models/index');
const handleError = require("../../exceptions/error-handler");

exports.getProfile = async (req, res) => {
  const {userId} = req.params;
  try {
    const user = await db.User.findByPk(userId);
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
}
