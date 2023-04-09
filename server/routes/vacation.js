const express = require('express');
const router = express.Router();
const vacationTypeController = require('../controllers/vacationTypeController');
const requestVacationController = require('../controllers/requestVacationController');
const VacationRequest = require("../models/vacation-request");
const UserVacation = require("../models/user-vacation");


// 관리자: 시스템 휴가유형 조회
router.get('/', vacationTypeController.getVacationTypes);
// 관리자 : 시스템 휴가유형 생성
router.post('/', vacationTypeController.create);
// 관리자: 시스템 휴가유형 수정

// 관리자: 시스템 휴가유형 삭제 (이거 만들지 않는게 좋을듯)

// POST /vacation/request
router.post('/request', requestVacationController.createRequest);

// 휴가사용요청 승인 (pending 일때만 가능) -> approved
router.patch('/request/approve/:vacationRequestId', requestVacationController.approveVacationRequest);
// 휴가사용요청 거절 (pending 일때만 가능) -> refused
router.patch('/request/refuse/:vacationRequestId', requestVacationController.refuseVacationRequest);
// 휴가사용요청 취소 (approved 일때만 ) => canceled
router.patch('/request/cancel/:vacationRequestId', requestVacationController.cancelVacationRequest);


module.exports = router;
