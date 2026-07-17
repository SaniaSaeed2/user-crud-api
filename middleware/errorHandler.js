// Centralized error handler. Converts raw Mongoose/Mongo errors into
// clean, consistent JSON instead of leaking stack traces to the client.
export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.message);

  // Duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `A user with this ${field} already exists.`
    });
  }

  // Mongoose schema validation error (missing/invalid fields)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", ")
    });
  }

  // Malformed ObjectId passed somewhere validation missed
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}.`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}

// 404 handler for undefined routes.
export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} does not exist.`
  });
}
