// const JWT_SECRET = "abciseasyas123";

const { JWT_SECRET = "not-secret" } = process.env;

module.exports = { JWT_SECRET };
