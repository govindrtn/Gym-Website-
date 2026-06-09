function notFoundHandler(request, response) {
  response.status(404).json({
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;

  return response.status(statusCode).json({
    message: error.message || "Server error.",
  });
}

export { errorHandler, notFoundHandler };
