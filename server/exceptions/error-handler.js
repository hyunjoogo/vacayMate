function handleError(res, error) {
  console.log(error);
  res.status(500).json({error: "서버 에러 발생"});
}

module.exports = handleError;
