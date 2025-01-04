import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatusCodes from 'http-status-codes';
import { enrolledCourseServices } from './enrolledCourse.services';

// create enrolled course
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

// update enrolled course
const updateEnrolledCourse = catchAsync(async (req, res) => {
  console.log(req.user);
  // const result = await enrolledCourseServices.updateEnrolledCourseIntoDb(
  //   req.body,
  // );
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: 'Enrolled Course Updated Successfully',
    data: null,
  });
});

export const enrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourse,
};
