import { config } from 'dotenv';
config();

export const successHandler = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    status: 'error',
    message: err?.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
