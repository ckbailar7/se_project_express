const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const ERRORS = require("../utils/errors");
const AuthRequiredError = require("../utils/errorClasses/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    const error = new AuthRequiredError(ERRORS.AUTH_REQUIRED.DEFAULT_MESSAGE);
    error.statusCode = ERRORS.AUTH_REQUIRED.STATUS;
    return next(error);
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err);
    const error = new AuthRequiredError(ERRORS.AUTH_REQUIRED.DEFAULT_MESSAGE);
    error.statusCode = ERRORS.AUTH_REQUIRED.STATUS;
    return next(error);
  }

  req.user = payload;

  next();
  return false;
};
