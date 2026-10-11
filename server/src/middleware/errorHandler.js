/**
 * Centralized Express Error Handling Middleware
 * Ensures safe, structured JSON errors without leaking credentials or stack traces
 */
export function errorHandler(err, req, res, next) {
  // Determine HTTP status code
  let statusCode = err.statusCode || err.status || 500;
  let errorCode = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'An unexpected error occurred while processing the request.';

  // Intercept Gemini API specific error codes or strings
  if (err.message && err.message.includes('API_KEY_INVALID')) {
    statusCode = 401;
    errorCode = 'INVALID_API_KEY';
    message = 'The provided Google Gemini API key is invalid. Please verify GEMINI_API_KEY.';
  } else if (err.message && (err.message.includes('RESOURCE_EXHAUSTED') || err.message.includes('429'))) {
    statusCode = 429;
    errorCode = 'GEMINI_QUOTA_EXCEEDED';
    message = 'Google Gemini API rate limit or quota exceeded. Please wait a few moments before trying again.';
  } else if (err.message && err.message.includes('SAFETY')) {
    statusCode = 400;
    errorCode = 'SAFETY_FILTER_TRIGGERED';
    message = 'The prompt or generated content triggered safety filters. Please adjust the premise or creative constraints.';
  }

  // Never expose sensitive details in production
  const responsePayload = {
    success: false,
    error: {
      message,
      code: errorCode
    }
  };

  // Add validation details if present
  if (err.details) {
    responsePayload.error.details = err.details;
  }

  // Log server errors safely without leaking keys
  if (statusCode >= 500) {
    console.error(`[ERROR] [${req.method} ${req.originalUrl}] [${errorCode}]:`, message);
  } else {
    console.warn(`[WARN] [${req.method} ${req.originalUrl}] [${errorCode}]:`, message);
  }

  res.status(statusCode).json(responsePayload);
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
      code: 'ROUTE_NOT_FOUND'
    }
  });
}
