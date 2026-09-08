const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  console.error("🔥 STACK:", err.stack);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};

export default errorHandler;
// djlkasdf