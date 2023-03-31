const express = require('express');
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const User = require('../models/User');
const UserVacation = require('../models/UserVacation');

// 휴가 유형 생성
router.post('/:id', verifyToken, async (req, res) => {
    // TODO validation
    // vacationType이 맞는지 확인할 것 (utils > vacationType.js 참조)
    // if (!vacationTypes.includes(req.body.type)) {
    //   res.status(400).json({ message: 'Invalid vacation type' });
    //   return;
    // }

    try {
      // TODO 사용자가 존재하는지 여부 확인할 것
      //
      const userVacation = await UserVacation.findOne({
        user: req.params.id, type: req.body.type,
        expirationDate: req.body.expirationDate
      });

      console.log(userVacation);
      if (userVacation) {
        res.status(400).json({message: '이미 생성된 휴가 유형입니다.'});
        return;
      }
      const newUserVacation = new UserVacation({
        user: req.params.id,
        type: req.body.type,
        totalDays: req.body.totalDays,
        leftDays: req.body.leftDays,
        expirationDate: req.body.expirationDate
      });
      console.log(newUserVacation);
      await newUserVacation.save();

      res.status(200).json({message: '휴가 생성 완료'});
    } catch (err) {
      console.error(err);
      res.status(500).json({message: '서버 에러가 발생했습니다.'});
    }
  }
);

module.exports = router;
