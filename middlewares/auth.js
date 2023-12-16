const jwt = require("jsonwebtoken");
//const JWT_SECRET = require("../utils/config");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  //Auth will go here
  const { authorization } = req.headers;

  //check if header exists and if starts with '"Bearer"
  if (!authorization || authorization.startsWith("Bearer")) {
    return res.status(401).send({ message: "Authorization required" });
  }

  //getting token
  const token = authorization.replace("Bearer", "");

  //verify the token
  let payload;
  // const payload = jwt.verify(token, JWT_SECRET);
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: "Authorization required" });
  }

  req.user = payload; // Assigning the payload to the request object
  next(); // Sending the request to the next middleware
};
