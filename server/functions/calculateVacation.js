export function calculateVacation(startDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  const now = new Date();
  const workStart = new Date(startDate);

  const yearDiff = now.getFullYear() - workStart.getFullYear();

  // 연차 발생일 계산
  const vacationDate = new Date(
    workStart.getFullYear() + yearDiff,
    workStart.getMonth(),
    workStart.getDate()
  );
  if (now < vacationDate) {
    vacationDate.setFullYear(workStart.getFullYear() + yearDiff - 1);
  }

  // 연차 일수 계산
  let vacationDays = 0;
  if (yearDiff >= 0 && yearDiff < 2) {
    vacationDays = now.getMonth() + 1;
  } else if (yearDiff >= 2 && yearDiff < 4) {
    vacationDays = 15 + (yearDiff - 1);
  } else if (yearDiff >= 4 && yearDiff < 6) {
    vacationDays = 17 + (yearDiff - 3);
  } else if (yearDiff >= 6) {
    vacationDays = 18;
  }

  return { vacationDate, vacationDays };
}


function calculateVacationPeriod(startDate, useType) {
  const startDateMoment = moment(startDate);
  const period = {
    startDt: startDateMoment.format('YYYY-MM-DD'),
    endDt: '',
    totalCount: 0
  };

  switch (useType) {
    case '일차':
      period.totalCount = 1;
      break;
    case '오전반나절':
      period.totalCount = 0.5;
      break;
    case '오후반나절':
      period.totalCount = 0.5;
      break;
    default:
      period.totalCount = 0;
      break;
  }

  const endDateMoment = moment(startDate).add(period.totalCount, 'days');

  period.endDt = endDateMoment.format('YYYY-MM-DD');

  return period;
}
