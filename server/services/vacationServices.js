import { db } from "../models/index.js";
import { calculateTotalAnnual } from "../functions/calculateAnnual.js";

// 사용자의 모든 휴가유형을 찾는다.
const getUserAllVacations = async (userId) => {
  const userAllVacations = await db.Vacation.findAll({
    where: {
      user_id: userId
    }
  });
  return userAllVacations;
};

// 하나의 휴가유형을 찾는다.
const getUserVacationByPK = async (vacationId) => {
  const vacation = await db.Vacation.findByPk(vacationId, {
    include: {
      model: db.User
    }
  });
  return vacation;
};

const createAnnualVacation = async (member, {enterDate, annualMemo}, transaction) => {
  // 연차 계산 후 생성하기
  const {expirationDate, totalAnnualDays} = calculateTotalAnnual(enterDate);

  const memberAnnualVacation = await member.createVacation(
    {
      type: "연차",
      memo: annualMemo, // 메모를 받아야겠네?
      left_days: totalAnnualDays,
      total_days: totalAnnualDays,
      expiration_date: expirationDate
    }, {transaction: transaction});

  return memberAnnualVacation;
};

export { getUserAllVacations, getUserVacationByPK, createAnnualVacation};
