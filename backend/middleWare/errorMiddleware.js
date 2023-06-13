const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;  //server error
  res.status(statusCode);
  res.json({
    message: err.message,
    //write the stack (chemin) of the error only in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = errorHandler;
