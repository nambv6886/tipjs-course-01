'use strict'
const {
  StatusCodes,
  ReasonPhrases
} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDEN) {
    super(message, statusCode);
  }
}
class BadRequestRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDEN) {
    super(message, statusCode);
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode);
  }
}
class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode);
  }
}
class ForbidenError extends ErrorResponse {
  constructor(message = ReasonPhrases.ForbidenError, statusCode = StatusCodes.ForbidenError) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestRequestError,
  AuthFailureError,
  NotFoundError,
  ForbidenError
}