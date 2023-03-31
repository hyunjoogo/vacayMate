const express = require('express');
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const User = require('../models/User');
const UserVacation = require('../models/UserVacation');

// Define a route to handle the POST request to create a new UserVacation document
router.post('/create/vacation', verifyToken, async (req, res) => {
  try {
    let userVacation =
      UserVacation.findOne({type: req.body.type, expirationDate: req.body.expirationDate});
    if (userVacation) {
      res.status(400).json({message: '이미 생성된 휴가 유형입니다.'});
      return;
    }
    userVacation = new UserVacation({
      user: req.body.user,
      type: req.body.type,
      totalDays: req.body.totalDays,
      leftDays: req.body.leftDays,
      expirationDate: req.body.expirationDate
    });
    await userVacation.save();
    res.status(200).json({message: '휴가 생성 완료'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: '서버 에러가 발생했습니다.'});
  }
});


