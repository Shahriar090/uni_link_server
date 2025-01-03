import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatusCodes from 'http-status-codes';
import { enrolledCourseServices } from './enrolledCourse.services';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await enrolledCourseServices.createEnrolledCourseIntoDb(
    userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatusCodes.CREATED,
    success: true,
    message: 'Enrolled To Course Successfully',
    data: result,
  });
});

export const enrolledCourseControllers = { createEnrolledCourse };
