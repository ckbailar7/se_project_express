module.exports = {
  INVALID_REQUEST: {
    STATUS: 400, // if (err.name === 'Validation Error)
    DEFAULT_MESSAGE: "INVALID REQUEST SENT",
  },
  NOT_FOUND: {
    STATUS: 404, // if (err.name === "Cast Error")
    DEFAULT_MESSAGE: "RESOURCE NOT FOUND ",
  },
  DEFAULT_ERROR: {
    STATUS: 500,
    DEFAULT_MESSAGE: "AN ERROR HAS OCCURED ON THE SERVER",
  },
};
