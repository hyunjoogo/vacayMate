import { YYYYMMDD } from "../const/dateFormat.js";
import dayjs from "dayjs";

export const getContinuousServiceMonths = (date, enterDate) => {
  const diffMonths = date.diff(dayjs(enterDate), 'month');
  return diffMonths;
};

function getAnnualExpirationDate(hireDate, year) {
  return dayjs(hireDate).add(year + 1, 'year').subtract(1, 'day').format(YYYYMMDD);
}

export function calculateTotalAnnual(enterDate) {
  const today = dayjs();
  const diffYears = today.diff(enterDate, 'year');
  const diffMonths = today.diff(enterDate, 'month');
  console.log('만 연도: ', diffYears, ' ', '만 개월: ', diffMonths);

  let totalAnnualDays = 0;
  if (diffYears === 0) {
    totalAnnualDays = diffMonths;
  } else {
    for (let i = 1; i <= diffYears; i++) {
      if (diffYears >= 7) {
        totalAnnualDays += 18;
      } else if (diffYears >= 5) {
        totalAnnualDays += 17;
      } else if (diffYears >= 3) {
        totalAnnualDays += 16;
      } else if (diffYears >= 1) {
        totalAnnualDays += 15;
      }
    }
    // 만 1년미만 전에 1년마다 쌓인 갯수
    totalAnnualDays += 11;
  }
  console.log('지금까지의 연차개수: ', totalAnnualDays);
  const expirationDate = getAnnualExpirationDate(enterDate, diffYears);
  console.log({expirationDate, totalAnnualDays});
  return {expirationDate, totalAnnualDays};
}

export function calculateAnnualVacation(continuousServiceMonths) {
  let annualVacation = 0;
  if (continuousServiceMonths < 12) {
    annualVacation = 1;
  } else if (continuousServiceMonths < 36) {
    annualVacation = 15;
  } else if (continuousServiceMonths < 60) {
    annualVacation = 16;
  } else if (continuousServiceMonths < 84) {
    annualVacation = 17;
  } else if (84 <= continuousServiceMonths) {
    annualVacation = 17;
  } else {
    throw new Error('잘못된 근속개월수입니다.')
  }

  return annualVacation;
}
