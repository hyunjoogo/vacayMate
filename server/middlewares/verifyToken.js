const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = new Error('Authorization 헤더가 없습니다.');
    err.status = 401;
    next(err);
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({message: 'JWT 검증에 실패했습니다.'});
  }
}

module.exports = verifyToken;
