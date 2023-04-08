const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const Time = require("../models/time");
const timezone = require('dayjs/plugin/timezone')
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc)
dayjs.extend(timezone)

// 전체 사용자 가지고 오기
router.post('/', async (req, res) => {
  const {currentTime, utcTime, dayjsTime} = req.body;
  console.log({currentTime, utcTime, dayjsTime});
  await Time.create({currentTime, utcTime, dayjsTime});

  const newTime = await Time.findAll()
  res.status(200).json({
    message: '사용자의 휴가 유형 등록이 완료되었습니다.',
    newTime
  });
})

module.exports = router;
