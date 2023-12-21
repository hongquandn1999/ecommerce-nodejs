const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized Error',
  FORBIDDEN: 'Forbidden Error',
  NOT_FOUND: 'Not Found Error',
  INTERNAL_SERVER: 'Internal Server Error',
  CONFLICT: 'Conflict Error',
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = STATUS_CODES.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    statusCode = STATUS_CODES.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = STATUS_CODES.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = STATUS_CODES.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    statusCode = STATUS_CODES.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.INTERNAL_SERVER,
    statusCode = STATUS_CODES.INTERNAL_SERVER
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};
