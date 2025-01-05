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
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user?.userId;
  const result = await enrolledCourseServices.updateEnrolledCourseMarksIntoDb(
    req.body,
    facultyId,
  );
  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: 'Enrolled Course Updated Successfully',
    data: result,
  });
});

export const enrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
