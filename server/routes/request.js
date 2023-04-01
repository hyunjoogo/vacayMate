const express = require('express');
const router = express.Router();

const RequestHistory = require('../models/requestHistory');
const UserVacation = require('../models/userVacation');
const vacationType = require("../utils/vacationType");
const useTypes = require("../utils/useTypes");
const verifyToken = require("../middlewares/verifyToken");
const calculateDateDiff = require("../utils/calculateDateDiff");
const getUseDaysByUseType = require("../utils/getUseDaysByUseType");

// POST /request
router.post('/:id', verifyToken, async (req, res) => {
  try {
    // 사용자가 입력한 정보
    const {type, useType, startDate, endDate} = req.body;
    const userId = req.params.id;

    // 휴가 종류에 대한 유효성 검사
    if (!vacationType.includes(type)) {
      return res.status(400).json({error: '잘못된 휴가유형입니다.'});
    }
    // // 사용종류에 대한 유효성 검사
    if (!useTypes.includes(useType)) {
      return res.status(400).json({error: '잘못된 사용종류입니다.'});
    }


    // 휴가 시작일자와 종료일자 검사
    const diffInDays = calculateDateDiff(startDate, endDate);
    if (diffInDays === -1) {
      return res.status(400).json({error: '시작일자는 종료일자보다 이전이어야 합니다.'});
    }

    // 사용자의 보유 휴가 정보 가져오기
    const userVacation = await UserVacation.findOne({user: userId, type});
    if (!userVacation) {
      return res.status(400).json({error: '해당 유형의 휴가 보유 기록을 찾을 수 없습니다.'});
    }

    // 사용자의 잔여일 수 계산
    const requestDays = getUseDaysByUseType(useType) * diffInDays;
    if (userVacation.leftDays < requestDays) {
      return res.status(400).json({error: '신청일이 잔여일을 초과합니다.'});
    }

    // RequestHistory 컬렉션에 새로운 요청 생성
    const request = new RequestHistory({
      user: userId,
      type,
      useType,
      startDate,
      endDate,
      status: 'pending',
      requestDays
    });
    await request.save();

    // 보유 휴가 정보 업데이트
    userVacation.leftDays -= requestDays;
    await userVacation.save();

    res.json({request, userVacation});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: '서버 오류가 발생했습니다.'});
  }
});

module.exports = router;
