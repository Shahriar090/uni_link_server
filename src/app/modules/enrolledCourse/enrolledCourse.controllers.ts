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

// get my enrolled courses
const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req.user?.userId;

  const result = await enrolledCourseServices.getMyEnrolledCoursesFromDb(
    studentId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatusCodes.OK,
    success: true,
    message: 'My Enrolled Courses Retrieved Successfully',
    meta: result.meta,
    data: result.result,
  });
});

export const enrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourses,
};
