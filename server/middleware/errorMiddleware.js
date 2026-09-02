function errorHandler(err, req, res, next) {
  console.error('[Error Handler]:', err.stack || err.message);
  
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
}

module.exports = {
  errorHandler
};
