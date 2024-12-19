import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import httpStatus from 'http-status-codes';
import AppError from '../errors/appError';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You Are Not Authorized!',
        '',
      );
    }
    next();
  });
};

export default auth;
