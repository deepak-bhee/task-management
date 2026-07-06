export function notFoundHandler(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(error.errors).map((item) => item.message).join(', ')
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid resource id'
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: 'A record with that value already exists'
    });
  }

  res.status(statusCode).json({
    message: error.message || 'Server error'
  });
}
