module.exports = {
  INVALID_REQUEST: {
    STATUS: 400,
    DEFAULT_MESSAGE: "INVALID REQUEST SENT",
  },

  INVALID_LOGIN_REQUEST: {
    STATUS: 400,
    DEFAULT_MESSAGE: "User email or password in missing or incorrect",
  },
  AUTH_REQUIRED: {
    STATUS: 401,
    DEFAULT_MESSAGE: "Authorization required, bad token",
  },
  FORBIDDEN: {
    STATUS: 403,
    DEFAULT_MESSAGE: "FORBIDDEN REQUEST",
  },

  NOT_FOUND: {
    STATUS: 404,
    DEFAULT_MESSAGE: "RESOURCE NOT FOUND ",
  },
  ALREADY_EXSISTS: {
    STATUS: 409,
    DEFAULT_MESSAGE: "User with this email already exists",
  },
  DEFAULT_ERROR: {
    STATUS: 500,
    DEFAULT_MESSAGE: "AN ERROR HAS OCCURED ON THE SERVER",
  },
};
