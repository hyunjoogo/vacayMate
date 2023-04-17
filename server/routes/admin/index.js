import express from "express";
import * as membersController from "../../controller/admin/membersController.js";
import * as requestController from "../../controller/admin/requestController.js";


const AdminRouter = express.Router();

// TODO response할 때 카멜케이스로 내려주는 코드 추가할 것
// admin

// 회원정보 목록조회
AdminRouter.get('/members', membersController.getMembers)

// 회원정보 상세조회
AdminRouter.get('/members/:memberNo', membersController.getMemberDetail)

// 회원정보 수정(부서, 직책)
AdminRouter.patch('/members/:memberNo')

// 회원 관리자 등업
AdminRouter.patch('/members/:memberNo/role')

// 회원 입사날짜 등록
AdminRouter.post('/members/:memberNo/enter-date', membersController.createEnterDate)

// 회원 퇴사처리
AdminRouter.patch('/members/:memberNo/out')


// 회원 요청 목록조회
AdminRouter.get('/request', requestController.getRequestsList)

// 회원 요청 상세조회
AdminRouter.get('/request/:requestId', requestController.getDetailRequest)

// 회원 요청 승인
AdminRouter.post('/request/approve/:requestId', requestController.approveRequest)

// 회원 요청 거절
AdminRouter.post('/request/refuse/:requestId')


export default AdminRouter;
