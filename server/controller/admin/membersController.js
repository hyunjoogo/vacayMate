import * as membersServices from "../../services/membersServices.js";
import * as vacationServices from "../../services/vacationServices.js";
import handleError from "../../exceptions/error-handler.js";
import { db } from "../../models/index.js";
import { CustomError } from "../../exceptions/CustomError.js";
import { isValidDate } from "../../functions/valid/isValidDate.js";

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
    const {memberNo} = req.params;
    const member = await membersServices.getMemberDetail(memberNo);
    res.status(200).json(member);
  } catch (error) {
    handleError(res, error);
  }
};

const createEnterDate = async (req, res) => {
  const {memberNo} = req.params;
  const {enterDate, annualMemo} = req.body;

  // 유효하지 않은 날짜 형식일 경우
  if (!isValidDate(enterDate)) {
    throw new CustomError(400, "잘못된 날짜형식입니다.");
  }

  /* FLOW
    1. 사용자의 정보에 입사일을 입력한다.
    2. 사용자의 휴가유형 중 '연차'가 있는지 확인한다.
    3. 연차 계산 수식을 이용해서 지금까지 생성된 연차와 연차 만료일을 구한다.
    4. 이 정보를 토대로 사용자의 휴가유형 중 '연차'를 생성해준다.
    5. 연차 자동 생성 스케줄러에 연차 만료일과 사용자의 ID를 추가해준다.
   */
  const transaction = await db.sequelize.transaction();
  try {
    const updatedMember = await membersServices.addMemberEnterDate(memberNo, enterDate, transaction);
    const memberVacations = await vacationServices.createAnnualVacation(updatedMember, {
      enterDate,
      annualMemo
    }, transaction);

    // // TODO 이 사람의 만료일을 AutoAnnualCreator에게 넘겨주기
    await transaction.commit();
    res.status(200).json({updatedMember, memberVacations});
  } catch (error) {
    await transaction.rollback();
    handleError(res, error);
  }
};

export { getMembers, getMemberDetail, createEnterDate };
