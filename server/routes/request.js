const express = require("express");
const router = express.Router();
const {getRequestById, createRequest, getRequests} = require("../controllers/requestController");


router.post("/:userId", createRequest);

router.get("/", getRequests);

router.get("/:id", getRequestById);

module.exports = router;

// GET /request 목록조회
// POST /request 등록
// GET /request/:id 상세조회
// PATCH /request/:id 수정
// PATCH /request/:id/cancel 취소
