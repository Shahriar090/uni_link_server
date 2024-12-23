import config from '../../config';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  // check if the user is exists or not
  const user = await User.isUserExistsByCustomId(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No User Found With This Id!', '');
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

  // check hashed vs plain password
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your Password Did Not Matched!',
      '',
    );
  }

  // access grunted. send access and refresh token
  const jwtPayload = {
    userId: user?.id,
    userRole: user?.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    config.access_token_secret as string,
    { expiresIn: '2d' },
  );
  return { accessToken, needsPasswordChange: user?.needsPasswordChange };
};

export const authServices = { loginUser };
