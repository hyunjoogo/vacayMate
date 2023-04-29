import Sequelize from 'sequelize';
import { db } from "../models/index.js";
import { calculateAnnualVacation, getContinuousServiceMonths } from "../functions/calculateAnnual.js";
import dayjs from "dayjs";

const getUserWithSameMonthDay = async (month, day) => {
  const users = await db.User.findAll({
    where: {
      is_leave: false,
      enter_date: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('enter_date')), '=', month),
          Sequelize.where(Sequelize.fn('DAY', Sequelize.col('enter_date')), '=', day)
        ]
      }
    }
  });
  return users;
};

const getUserWithSameDay = async (day) => {
  const users = await db.User.findAll({
    where: {
      is_leave: false,
      enter_date: {
        [Sequelize.Op.and]: [
          // Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('enter_date')), '=', month),
          Sequelize.where(Sequelize.fn('DAY', Sequelize.col('enter_date')), '=', day)
        ]
      }
    }
  });
  return users;
}

function getMonthAndDay(date) {
  const month = date.month() + 1;
  const day = date.date();
  return {month, day};
}

const autoCreateAnnualVacation = async (today) => {
  const {month, day} = getMonthAndDay(today);
  console.log({month, day});

  // ------------- 1년 이상
  // 입사
  const usersWithSameMonthDay = await getUserWithSameMonthDay(month, day);

  for (const user of usersWithSameMonthDay) {
    // 근속개월 계산한다.
    const months = getContinuousServiceMonths(today, user.enter_date);
    // 1년 이상인 사용자의 연차 모델을 조회해서 개월수에 맞게 연차와 만료기간을 추가해준다.
    if (months >= 12) {
      const userAnnualVacation = await db.Vacation.findOne({
        where: {
          user_id: user.id,
          type: "연차"
        }
      });
      const updateExpirationDate = dayjs(userAnnualVacation.expiration_date).add(1, "year").utc().format();
      const addAnnualVacation = calculateAnnualVacation(months);
      await userAnnualVacation.update({
        left_days: userAnnualVacation.left_days + addAnnualVacation,
        total_days: userAnnualVacation.total_days + addAnnualVacation,
        expiration_date: updateExpirationDate
      });
    }
  }
  ///// -------------  1년 미만
  const usersWithSameDay = await getUserWithSameDay(day);
  for (const user of usersWithSameDay) {
    // 근속개월 계산한다.
    const months = getContinuousServiceMonths(today, user.enter_date);
    // 1년 이상인 사용자의 연차 모델을 조회해서 개월수에 맞게 연차와 만료기간을 추가해준다.
    if (months < 12) {
      const userAnnualVacation = await db.Vacation.findOne({
        where: {
          user_id: user.id,
          type: "연차"
        }
      });
      const updateExpirationDate = dayjs(userAnnualVacation.expiration_date).add(1, "month").utc().format();
      const addAnnualVacation = calculateAnnualVacation(months);
      await userAnnualVacation.update({
        left_days: userAnnualVacation.left_days + addAnnualVacation,
        total_days: userAnnualVacation.total_days + addAnnualVacation,
        expiration_date: updateExpirationDate
      });
    }
  }


  return usersWithSameMonthDay;
};


export { autoCreateAnnualVacation };
