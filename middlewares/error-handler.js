module.exports = (err, req, res, next) => {
  // if an error recieved has no status , SET IT TO 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};
