import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import httpStatus from 'http-status-codes';
import AppError from '../errors/appError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRoles } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRoles[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;

    // check if token is not provided
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You Are Not Authorized!',
        '',
      );
    }

    // check if token is valid
    jwt.verify(token, config?.access_token_secret as string, (err, decoded) => {
      if (err) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You Are Not Authorized! Your Token is Invalid/Expired',
          '',
        );
      }

      // check if user has required roles
      if (
        requiredRoles &&
        !requiredRoles.includes((decoded as JwtPayload)?.userRole as TUserRoles)
      ) {
        throw new AppError(httpStatus.FORBIDDEN, 'You Are Not Authorized!', '');
      }
      req.user = decoded as JwtPayload;
    });
    next();
  });
};

export default auth;
