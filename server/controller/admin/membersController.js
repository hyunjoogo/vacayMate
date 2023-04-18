import { Sequelize } from "sequelize";

import * as membersServices from "../../services/membersServices.js";
import handleError from "../../exceptions/error-handler.js";
import { db } from "../../models/index.js";
import { YYYYMMDD } from "../../const/dateFormat.js";
import dayjs from "dayjs";
import { calculateTotalAnnual } from "../../functions/calculateAnnual.js";
import { ROLE_TYPE } from "../../const/admin.js";
import { CustomError } from "../../exceptions/CustomError.js";


const getMembers = async (req, res) => {
  try {
    const {nowPage = 1, pageSize = 10, name, email, role, isLeave} = req.query;
    const result = await membersServices.getMembersListPagination({
      nowPage, pageSize, name, email, role, isLeave
    });
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

const getMemberDetail = async (req, res) => {


  try {
    // TODO Validation 생각해보기
    // TODO Service로 옮기기
    const {memberNo} = req.params;
    const member = await membersServices.getMemberDetail(memberNo);
    // 대상 회원의 휴가종류 가지고 와서 유형별 remain/total 넘겨주기
    const memberVacations = await db.Vacation.findAll({
      where: {user_id: memberNo}
    });
    // 대상 회원의 요청 가지고 와서 상태별 갯수 넘겨주기
    const memberRequests = await db.Request.findAll({
      where: {user_id: memberNo}
    });

    res.status(200).json({member, memberVacations, memberRequests});
  } catch (error) {
    handleError(res, error);
  }
};

const createEnterDate = async (req, res) => {
  const {memberNo} = req.params;
  const {enterDate} = req.body;

  const isValidFormat = dayjs(enterDate, YYYYMMDD, true).format(YYYYMMDD) === enterDate;
  const isValidDate = dayjs(enterDate, YYYYMMDD, true).isValid();

  const transaction = await db.sequelize.transaction();

  try {
    // 유효하지 않은 날짜 형식일 경우
    if (isValidFormat === false || isValidDate === false) {
      throw new CustomError(400, "잘못된 날짜형식입니다.");
    }

    const member = await membersServices.getMemberByPK(memberNo);

    // 입사날짜가 이미 입력되어 있는 경우
    if (member.enter_date !== null) {
      throw new CustomError(400, "이미 입사날짜가 입력되어 있습니다.");
    }

    // 입사날짜 입력하기
    const updatedMember = await member.update({enter_date: enterDate}, {transaction});

    // 회원의 휴가유형을 조회하여 연차 생성이 이미 되어 있으면 에러
    const memberVacations = await db.Vacation.findOne({
      where: {user_id: memberNo, type: "연차"}
    });

    if (memberVacations !== null) {
      throw new CustomError(400, "이미 생성된 연차가 존재합니다.");
    }

    // 연차 계산 후 생성하기
    const {expirationDate, totalAnnualDays} = calculateTotalAnnual(enterDate);

    // 생성된 연차 remain, total 테이블에 저장
    const memberAnnual = await updatedMember.createVacation(
      {
        type: "연차",
        memo: "김현주 연차", // 메모를 받아야겠네?
        left_days: totalAnnualDays,
        total_days: totalAnnualDays,
        expiration_date: expirationDate
      }, {transaction: transaction});

    // TODO 이 사람의 만료일을 AutoAnnualCreator에게 넘겨주기

    await transaction.commit();

    res.status(200).json({memberVacations, memberAnnual});

  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export { getMembers, getMemberDetail, createEnterDate };
