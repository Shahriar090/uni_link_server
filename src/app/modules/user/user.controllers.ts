import { userServices } from './user.services';
import httpStatus from 'http-status-codes';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';

// create a student
const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;
  const result = await userServices.createStudentIntoDb(password, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Created Successfully',
    data: result,
  });
});

export const userControllers = { createStudent };
