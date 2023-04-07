const express = require('express');
const router = express.Router();

const userVacationTypeController= require("../controllers/userVacationTypeController");
const isUser = require("../middlewares/isUser");
const isAdmin = require("../middlewares/isAdmin");

// 전체 사용자 가지고 오기
router.get('/');

// 사용자 상세조회
router.get('/:userId');

// 사용자의 휴가유형
router.post('/vacation-type', isUser, isAdmin, userVacationTypeController.createUserVacation);

// 사용자의 휴가유형 수정


module.exports = router;
