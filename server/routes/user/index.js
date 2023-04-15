const express = require('express');
const router = express.Router();
const profileController = require("../../controller/user/profileController");
const vacationController = require("../../controller/user/vacationController");
const requestController = require("../../controller/user/requestController");

// 사용자 상세조회
router.get('/profile', profileController.getProfile)

// 휴가종류 조회
router.get('/vacation', vacationController.getVacations);
// 휴가종류 상세조회
router.get('/vacation/:vacationId', vacationController.getDetailVacation);
// 수정?
router.patch('/vacation');

// 휴가사용요청 조회
router.get('/request', requestController.getRequest);
// 휴가사용요청 등록
router.post('/request', requestController.createRequests);

// 휴가사용요청 상세조회
// getDetailRequest
router.get('/request/:requestId', requestController.getDetailRequest);
// 휴가사용요청 취소
// cancelRequest
router.get('/request/cancel/:requestId');

module.exports = router;
