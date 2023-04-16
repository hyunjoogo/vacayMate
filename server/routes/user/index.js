import express from "express";
import * as profileController from "../../controller/user/profileController.js";
import * as vacationController from "../../controller/user/vacationController.js";
import * as requestController from "../../controller/user/requestController.js";

const UserRouter = express.Router();

// TODO response할 때 카멜케이스로 내려주는 코드 추가할 것
// 사용자 상세조회
UserRouter.get('/profile', profileController.getProfile);

// 휴가종류 조회
UserRouter.get('/vacation', vacationController.getVacations);
// 휴가종류 상세조회
UserRouter.get('/vacation/:vacationId', vacationController.getDetailVacation);
// 수정?
UserRouter.patch('/vacation');

// 휴가사용요청 조회
UserRouter.get('/request', requestController.getRequest);
// 휴가사용요청 등록
UserRouter.post('/request', requestController.createRequests);

// 휴가사용요청 상세조회
UserRouter.get('/request/:requestId', requestController.getDetailRequest);
// 휴가사용요청 취소
UserRouter.post('/request/cancel/:requestId', requestController.cancelRequest);

export default UserRouter;
