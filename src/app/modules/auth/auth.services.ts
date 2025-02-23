import config from '../../config';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateJwtToken, verifyJwtToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

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

  const accessToken = generateJwtToken(
    jwtPayload,
    config.access_token_secret as string,
    config.access_token_expiry as string,
  );

  const refreshToken = generateJwtToken(
    jwtPayload,
    config.refresh_token_secret as string,
    config.refresh_token_expiry as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

// change password
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByCustomId(userData?.userId);
  console.log('current user', user);
  // check if the user is exists or not
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
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your Password Did Not Matched!',
      '',
    );
  }

  // hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData?.userId,
      role: userData?.userRole,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

// refresh token
const refreshToken = async (token: string) => {
  // check if token is not provided
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Authorized!', '');
  }

  // check if user has required roles
  const decoded = verifyJwtToken(token, config.refresh_token_secret as string);

  const { userId, iat } = decoded;

  // check if the user is exists or not
  const user = await User.isUserExistsByCustomId(userId);
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

  // check if the jwt is issued before password change
  if (
    user?.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChange(user?.passwordChangedAt, iat as number)
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Password Changed! Please Login Again',
      '',
    );
  }

  // send new access token

  const jwtPayload = {
    userId: user?.id,
    userRole: user?.role,
  };

  const accessToken = generateJwtToken(
    jwtPayload,
    config.access_token_secret as string,
    config.access_token_expiry as string,
  );

  return {
    accessToken,
  };
};

// forget password
const forgetPassword = async (userId: string) => {
  // check if the user is exists or not
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No User Found With This User Id!',
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

  const jwtPayload = {
    userId: user?.id,
    userRole: user?.role,
  };

  const resetToken = generateJwtToken(
    jwtPayload,
    config.access_token_secret as string,
    '10m',
  );

  const resetPasswordLink = `${config.reset_password_link}?id=${user?.id}&token=${resetToken}`;

  // send email with reset link
  sendEmail(user?.email, resetPasswordLink);
};

// reset password
const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // check if the user is exists or not
  const user = await User.isUserExistsByCustomId(payload?.id);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No User Found With This User Id!',
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

  // verify the token

  const decoded = verifyJwtToken(token, config.access_token_secret as string);

  // check if decoded token's id and payload's id is same
  if (payload?.id !== decoded?.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Authorized!', '');
  }

  // hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // save new password into DB
  await User.findOneAndUpdate(
    { id: decoded.userId, role: decoded.userRole },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const authServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
