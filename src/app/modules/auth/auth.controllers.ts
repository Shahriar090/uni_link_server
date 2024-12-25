import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { authServices } from './auth.services';
import httpStatus from 'http-status-codes';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Login Successful',
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {});

export const authControllers = { loginUser, changePassword };
