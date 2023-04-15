const stateInProgress = ["pending", "approved"];

function filterUsingTypeByStatus(data) {
  const filteredData = data.filter(item => stateInProgress.includes(item.status));
  const usingTypeList = filteredData.map(item => item.using_type);
  return usingTypeList;
}

function isPossibleUsingType(sameUseDateRequests, usingType) {
  const usingTypeArray = filterUsingTypeByStatus(sameUseDateRequests)
  // 배열요소가 '오전반차'만 있으면 usingType '오후반차' 일 경우 true, 나머지는 false
  if (usingTypeArray.length === 1 && usingTypeArray.includes('오전반차')) {
    return usingType === '오후반차';
  }

  // 배열요소가 '오후반차'만 있으면 usingType '오전반차' 일 경우 true, 나머지는 false
  if (usingTypeArray.length === 1 && usingTypeArray.includes('오후반차')) {
    return usingType === '오전반차';
  }

  // 배열요소가 '일차'만 있으면 false
  if (usingTypeArray.includes('일차')) {
    return false;
  }

  // 배열요소가 '오전반차' 와 '오후반차'가 있으면 false
  if (usingTypeArray.includes('오전반차') && usingTypeArray.includes('오후반차')) {
    return false;
  }

  // 모든 조건을 만족하지 않을 경우 true
  return true;
}

// 2. 있다면 신청한 사용유형이 겹치는지 확인
//    이미 신청한 사용유형이 '일차'일 경우 모든 유형 불가
//    '오전반차' => '오후반차'만 가능
//    '오후반차' => '오전반차'만 가능
//    '오전반차'+'오후반차' => 모든 유형 불가
// 3. 그 휴가요청의 상태를 확인
//    - 거절, 취소상태면 겹쳐도 사용해도 되잖아.
//    - 대기, 승인이면

module.exports = isPossibleUsingType
