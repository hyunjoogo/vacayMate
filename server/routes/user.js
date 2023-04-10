const express = require('express');
const router = express.Router();

const userVacationTypeController = require("../controllers/userVacationTypeController");
const isUser = require("../middlewares/isUser");
const isAdmin = require("../middlewares/isAdmin");

// 전체 사용자 가지고 오기
router.get('/');

// 사용자 상세조회
router.get('/:userId');


// 사용자: 휴가유형 조회
router.get('/vacation-type', userVacationTypeController.getMyVacationTypes);

// 관리자 : 사용자의 입사일 생성
router.post('/admin/createAnnual/:userId', isUser, isAdmin, userVacationTypeController.createAnnual);

// 관리자: 사용자의 휴가유형 조회

// 관리자: 사용자의 휴가유형 생성
router.post('/admin/vacation-type/:userId', isUser, isAdmin, userVacationTypeController.createUserVacation);
// 관리자: 사용자의 휴가유형 수정


module.exports = router;
