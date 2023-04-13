const express = require('express');
const profileController = require("../../controller/user/profileController");
const vacationController = require("../../controller/user/vacationController");
const router = express.Router();

// 사용자 상세조회
// getProfile
router.get('/profile/:userId', profileController.getProfile)

// 휴가종류 조회
// getVacations
router.get('/vacation/:userId', vacationController.getVacations);
// 수정?
router.patch('/vacation');

// 휴가사용요청 조회
// getRequests
router.get('/request');
// 휴가사용요청 등록
// createRequest
router.post('/request');
// 휴가사용요청 상세조회
// getDetailRequest
router.get('/request/:requestId');
// 휴가사용요청 취소
// cancelRequest
router.get('/request/cancel/:requestId');

module.exports = router;
