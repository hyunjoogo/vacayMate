const express = require('express');
const membersController = require("../../controller/admin/membersController");
const router = express.Router();

// admin

// 회원정보 목록조회
router.get('/members', membersController.getMembers)

// 회원정보 상세조회
router.get('/members/:memberNo', membersController.getMemberDetail)

// 회원정보 수정(부서, 직책)
router.patch('/members/:memberNo')

// 회원 관리자 등업
router.patch('/members/:memberNo/role')

// 회원 입사날짜 등록
router.post('/members/:memberNo/enter-date')

// 회원 퇴사처리
router.patch('/members/:memberNo/out')


// 회원 요청 목록조회
router.get('/request')

// 회원 요청 상세조회
router.get('/request/:requestId')

// 회원 요청 승인
router.post('/request/:requestId/approve')

// 회원 요청 거절
router.post('/request/:requestId/refuse')


module.exports = router;
