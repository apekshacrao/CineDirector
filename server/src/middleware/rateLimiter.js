/**
 * In-memory sliding window rate limiter middleware
 * Provides protection against denial-of-service and duplicate rapid requests
 */
export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute window
  const maxRequests = options.maxRequests || 20;   // Max 20 calls per window
  const message = options.message || 'Too many requests. Please slow down and try again shortly.';

  const ipRequests = new Map();

  // Periodically clean up expired entries
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequests.entries()) {
      if (now - data.resetTime > windowMs) {
        ipRequests.delete(ip);
      }
    }
  }, 30 * 1000).unref();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let record = ipRequests.get(ip);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      ipRequests.set(ip, record);
    } else {
      record.count += 1;
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message
        }
      });
    }

    next();
  };
}
