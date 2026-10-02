import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error Handler:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Đã có lỗi xảy ra trên server.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
