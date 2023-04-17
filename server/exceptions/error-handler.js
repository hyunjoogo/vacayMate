import validationError from "./validation-error.js";

function handleError(res, error) {
  if (error.errorCode === 400) {
    console.error('\x1b[31m%s', 'ValidationError : ', error.message);
    return validationError(res, error.message);
  }
  console.error('\x1b[31m%s', 'Errrrrrror : ', error);
  res.status(500).json({error: "서버 에러 발생"});
}

export default handleError;
