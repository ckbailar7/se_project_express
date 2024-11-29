const { NODE_ENV, JWT_SECRET } = process.env;

if (NODE_ENV === "production" && !JWT_SECRET) {
  throw new Error("JWT secret must be set in production mode ");
}

const secretKey = NODE_ENV === "production" ? JWT_SECRET : "not-secret";

module.exports = { JWT_SECRET: secretKey };
