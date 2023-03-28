const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require("jsonwebtoken");

router.get('/', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = new Error('Authorization 헤더가 없습니다.');
    err.status = 401;
    next(err);
    return;
  }

  // JWT 검증
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(400).json({message: '등록되어 있지 않은 사용자입니다.'});
      return;
    }
    res.status(200).json({message: '로그인에 성공했습니다.', user});
  } catch (err) {
    res.status(401).json({message: 'JWT 검증에 실패했습니다.'});
  }
});

module.exports = router;
