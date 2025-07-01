// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Default error
  let error = {
    status: 'error',
    message: 'Internal server error',
    statusCode: 500
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    error.statusCode = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Redis connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    error.message = 'Database connection failed';
    error.statusCode = 503;
  }

  // Socket.IO errors
  if (err.type === 'SocketIOError') {
    error.message = err.message || 'WebSocket connection error';
    error.statusCode = 400;
  }

  // Custom application errors
  if (err.isOperational) {
    error.message = err.message;
    error.statusCode = err.statusCode || 400;
  }

  // Development vs Production error handling
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
    error.details = {
      name: err.name,
      code: err.code,
      type: err.type
    };
  }

  res.status(error.statusCode).json(error);
};

// Success response helper
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Error response helper
export const errorResponse = (res, message = 'Something went wrong', statusCode = 500, details = null) => {
  const response = {
    status: 'error',
    message,
    timestamp: new Date().toISOString()
  };

  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }

  res.status(statusCode).json(response);
};

// Custom error class for operational errors
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}