const express = require("express");
const router = express.Router();
const {getRequestById, createRequest, getRequests} = require("../controllers/requestController");

// GET /request 목록조회
router.get("/", getRequests);
// GET /request/:id 상세조회
router.get("/:id", getRequestById);
// POST /request 등록
router.post("/:userId", createRequest);

module.exports = router;




// PATCH /request/:id 수정
// PATCH /request/:id/cancel 취소
