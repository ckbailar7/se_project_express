// Using for Invalid req/ invalid login req

class invalidRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    // this.name = INVALID_REQUEST;
  }
}

module.exports = invalidRequestError;
