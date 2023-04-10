const User = require('../models/user');

const isUser = async (req, res, next) => {
  const {userId} = req.params;
  const user = await User.findByPk(userId);
  if (!user) {
    res.status(400).json({ success: false, message: '존재하지 않는 사용자입니다.' });
    return;
  }
  req.user = user; // 요청 객체에 사용자 정보를 추가합니다.
  next();
};

module.exports = isUser;
