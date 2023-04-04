const User = require("../models/User");
const vacationType = require("../utils/vacationType");
const useTypes = require("../utils/useTypes");
const calculateDateDiff = require("../utils/calculateDateDiff");
const UserVacation = require("../models/UserVacation");
const getUseDaysByUseType = require("../utils/getUseDaysByUseType");
const RequestHistory = require("../models/RequestHistory");
const {ObjectId} = require("mongoose").Types;


exports.getRequestById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({message: "Invalid id"});
    }
    const request = await RequestHistory.findById(req.params.id);

    if (!request) {
      return res.status(404).json({message: "Request not found"});
    }

    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};

exports.createRequest = async (req, res) => {
  try {
    // 사용자가 입력한 정보
    const {type, useType, startDate, endDate} = req.body;
    const userId = req.params.userId;

    // 휴가 사용자의 이름을 가져오기
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({error: "사용자 정보를 찾을 수 없습니다."});
    }
    console.log(user);
    const requestName = user.name;

    // 휴가 종류에 대한 유효성 검사
    if (!vacationType.includes(type)) {
      return res.status(400).json({error: "잘못된 휴가유형입니다."});
    }
    // // 사용종류에 대한 유효성 검사
    if (!useTypes.includes(useType)) {
      return res.status(400).json({error: "잘못된 사용종류입니다."});
    }

    // 휴가 시작일자와 종료일자 검사
    const diffInDays = calculateDateDiff(startDate, endDate);
    if (diffInDays === -1) {
      return res
      .status(400)
      .json({error: "시작일자는 종료일자보다 이전이어야 합니다."});
    }

    // 사용자의 보유 휴가 정보 가져오기
    const userVacation = await UserVacation.findOne({user: userId, type});
    if (!userVacation) {
      return res
      .status(400)
      .json({error: "해당 유형의 휴가 보유 기록을 찾을 수 없습니다."});
    }

    // 사용자의 잔여일 수 계산
    const requestDays = getUseDaysByUseType(useType) * diffInDays;
    if (userVacation.leftDays < requestDays) {
      return res.status(400).json({error: "신청일이 잔여일을 초과합니다."});
    }

    // RequestHistory 컬렉션에 새로운 요청 생성
    const request = new RequestHistory({
      user: userId,
      requestName,
      type,
      useType,
      startDate,
      endDate,
      status: "pending",
      requestDays
    });
    await request.save();

    // 보유 휴가 정보 업데이트
    userVacation.leftDays -= requestDays;
    await userVacation.save();

    res.json({request, userVacation});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "서버 오류가 발생했습니다."});
  }

};

exports.getRequests = async (req, res) => {
  const requestName = req.query.requestName; // requestName 검색 조건
  const type = req.query.type; // type 검색 조건
  const page = parseInt(req.query.page) || 1; // 페이지 번호, 기본값 1
  const limit = parseInt(req.query.limit) || 10; // 페이지당 문서 개수, 기본값 10

  // TODO 검색기간 조회 넣기
  // 이 검색조건은 무엇을 위한 검색조건인가?
  // 생성일시?
  // 아니면 휴가 일시?
  // 일단은 기간검색 없이 해보자.
  let conditions = {}; // 검색 조건 객체

  // requestName 검색 조건이 있는 경우
  if (requestName) {
    conditions.requestName = new RegExp(requestName, "i"); // requestName 검색 조건이 있다면, 대소문자 구분 없이 검색
  }

  // type 검색 조건이 있는 경우
  if (type) {
    if (type !== "") {
      conditions.type = type; // type 검색 조건이 있다면, 검색 조건 객체에 추가
    }
  }
  const options = {
    skip: (page - 1) * limit, // 페이지 번호에 따라 건너뛸 문서 개수
    limit: limit // 페이지당 문서 개수
  };

  const requests = await RequestHistory.find(conditions, null, options) // 검색 조건과 옵션에 따라 문서 검색
  .exec();
  const totalCount = await RequestHistory.countDocuments(conditions).exec(); // 검색 조건에 해당하는 문서 개수 조회

  res.json({
    data: requests, // 검색된 문서들
    currentPage: page, // 현재 페이지 번호
    totalPages: Math.ceil(totalCount / limit), // 전체 페이지 수
    totalDocuments: totalCount // 검색된 문서 개수
  });
};
