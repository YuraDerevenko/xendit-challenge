class ValidationError extends Error {
  constructor(params) {
    super(params);
    this.error_code = "VALIDATION_ERROR";
    this.message = params.message;
    this.statusCode = 400;
  }
}

class RidesNotFoundError extends Error {
  constructor(params) {
    super(params);
    this.error_code = "RIDES_NOT_FOUND_ERROR";
    this.message = "Could not find any rides";
    this.statusCode = 400;
  }
}

class ServerError extends Error {
  constructor(params) {
    super(params);
    this.error_code = "SERVER_ERROR";
    this.message = "Unknown error";
    this.statusCode = 500;
  }
}

module.exports = {
  ValidationError,
  RidesNotFoundError,
  ServerError,
};
