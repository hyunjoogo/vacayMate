const dayjs = require('dayjs');
const DateFormat = require('../const/dateFormat');

const calculateAnnual = (enterDate) => {
  const today = dayjs();
  const diffYears = today.diff(enterDate, 'year');
  const diffMonths = today.diff(enterDate, 'month');
  console.log('만 연도: ', diffYears, ' ', '만 개월: ', diffMonths);
  let annualDays = 0;
  if (diffYears === 0) {
    annualDays = diffMonths;
  } else {
    if (diffYears >= 7) {
      annualDays = 18;
    } else if (diffYears >= 5) {
      annualDays = 17;
    } else if (diffYears >= 3) {
      annualDays = 16;
    } else if (diffYears >= 1) {
      annualDays = 15;
    }
  }
  const expirationDate = getAnnualExpirationDate(enterDate, diffYears);
  return {expirationDate, annualDays};
};

function getAnnualExpirationDate(hireDate, year) {
  return dayjs(hireDate).add(year + 1, 'year').subtract(1, 'day').format(DateFormat.YYYYMMDD);
}

function calculateTotalAnnual(enterDate) {
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

module.exports = {
  calculateAnnual, calculateTotalAnnual
};
