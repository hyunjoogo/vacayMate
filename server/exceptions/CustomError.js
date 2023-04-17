export class CustomError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.errorCode = errorCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
