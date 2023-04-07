function generateVacationRequests(useTimes, userId, vacationTypeId) {
  let isWrong = false;

  // TODO 입력값중에 null이나 ""이 있으면 isWrong = true, message =""
  // 시작일자와 종료일자와 useType 조합으로 totalCount가 맞는지 확인
  // useTimes의 type이 Object이거나 길이가 0이면?!
  const vacationRequests = useTimes.map(({startDt, endDt, useType, totalCount}) => {
    if (!startDt || !endDt || !useType || !totalCount) {
      isWrong = true;
    }

    return {
      userId,
      vacationTypeId,
      vacationStartDate: startDt,
      vacationEndDate: endDt,
      vacationTimeType: useType,
      totalVacationDays: totalCount,
      status: 'pending',
      createdAt: new Date()
    };
  });

  return {isWrong, vacationRequests};
}

module.exports = generateVacationRequests;
