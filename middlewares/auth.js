const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const ERRORS = require("../utils/errors");
const AuthRequiredError = require("../utils/errorClasses/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("No Authorization header found");
    const error = new AuthRequiredError(ERRORS.AUTH_REQUIRED.DEFAULT_MESSAGE);
    error.statusCode = ERRORS.AUTH_REQUIRED.STATUS;
    return next(error);
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("JWT payload:", payload);
  } catch (err) {
    console.log("JWT verification failed:", err);
    const error = new AuthRequiredError(ERRORS.AUTH_REQUIRED.DEFAULT_MESSAGE);
    error.statusCode = ERRORS.AUTH_REQUIRED.STATUS;
    return next(error);
  }

  req.user = payload;
  console.log("Authenticated user:", req.user); // Check if user info is attached to req.user
  next();
  return false;
};
