const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const ERRORS = require("../utils/errors");

// PREVIOUSLY moved JWT_SECRET from .env file ===> locally decalred variable ^

module.exports = (req, res, next) => {
  // Auth will go here
  const { authorization } = req.headers;
  // console.log(authorization);
  // check if header exists and if starts with '"Bearer"
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // console.log("Error Location ");
    return res
      .status(ERRORS.AUTH_REQUIRED.STATUS)
      .send({ message: "Authorization required" });
  }

  // getting token
  const token = authorization.replace("Bearer ", "");

  // verify the token
  let payload;
  // const payload = jwt.verify(token, JWT_SECRET);
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // console.log(err);
    return res
      .status(ERRORS.AUTH_REQUIRED.STATUS)
      .send({ message: ERRORS.AUTH_REQUIRED.DEFAULT_MESSAGE });
  }

  req.user = payload; // Assigning the payload to the request object

  next(); // Sending the request to the next middleware
  return false;
};
