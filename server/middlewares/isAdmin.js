const ADMIN = require('../utils/authRole');

const isAdmin = async (req, res, next) => {
  if (req.user.role !== ADMIN) {
    res.status(403).json({success: false, message: 'Admin 권한을 가진 사람만 휴가를 부여할 수 있습니다.'});
    return;
  }
  next();
};

module.exports = isAdmin;
