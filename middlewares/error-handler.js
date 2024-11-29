module.exports = (err, req, res, next) => {
  console.error("Error stack trace:", err.stack); // Logging the full stack trace for debugging
  console.error(err);
  console.error("Error details: ===>", {
    message: err.message,
    statusCode: err.statusCode,
    requestUrl: req.originalUrl,
    requestBody: req.body,
  });
  // if an error recieved has no status , SET IT TO 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};
