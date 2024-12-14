import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import httpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';

const loginUser = async (payload: TLoginUser) => {
  // check if the user is exists or not
  const isUserExists = await User.findOne({ id: payload?.id });
  console.log(isUserExists);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'No User Found With This Id!', '');
  }

  // check if the user is deleted
  const isDeleted = isUserExists?.isDeleted;
  if (isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This User Is Already Deleted',
      '',
    );
  }

  // check if the user is blocked
  const userStatus = isUserExists?.status;
  if (userStatus === 'Blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This User Is Blocked!', '');
  }

  // check hashed vs plain password
  const isPasswordValid = await bcrypt.compare(
    payload?.password,
    isUserExists?.password,
  );

  console.log(isPasswordValid);

  // access grunted. send access and refresh token

  return {};
};

export const authServices = { loginUser };
