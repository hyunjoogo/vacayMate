function handleError(res, error) {
  if (error.errorCode === 400) {
    console.error('\x1b[31m%s', 'ValidationError : ', error.message);
    return res.status(error.errorCode).json({error: error.message});
  }
  console.error('\x1b[31m%s', 'Errrrrrror : ', error);
  res.status(500).json({error: "서버 에러 발생"});
}

export default handleError;


// 받은 req의 DTO를 먼저 ifEmptyThrowBadReq 함수로
// if (DTO === null) {
//   throw new CustomError(400, "검색 종료일을 YYYY-MM-DD에 맞춰주세요.");
// }
