import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import httpStatus from 'http-status-codes';
import AppError from '../errors/appError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRoles } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { verifyJwtToken } from '../modules/auth/auth.utils';

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

    // check if user has required roles
    const decoded = verifyJwtToken(
      token,
      config?.access_token_secret as string,
    );

    const { userId, userRole, iat } = decoded;

    // check if the user is exists or not
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'No User Found With This Id!',
        '',
      );
    }

    // check if the user is deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'This User Is Already Deleted',
        '',
      );
    }

    // check if the user is blocked
    const userStatus = user?.status;
    if (userStatus === 'Blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This User Is Blocked!', '');
    }

    // check if the jwt is issued before password change
    if (
      user?.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChange(
        user?.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Password Changed! Please Login Again',
        '',
      );
    }

    if (requiredRoles && !requiredRoles.includes(userRole as TUserRoles)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You Are Not Authorized!', '');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
