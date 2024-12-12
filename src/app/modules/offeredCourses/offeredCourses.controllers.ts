import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { offeredCoursesServices } from './offeredCourses.services';
import httpStatus from 'http-status-codes';

// create
const createOfferedCourses = catchAsync(async (req, res) => {
  const result = await offeredCoursesServices.createOfferedCourseIntoDb(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Created Successfully',
    data: result,
  });
});

// update
const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCoursesServices.updateOfferedCourseIntoDb(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Updated Successfully!',
    data: result,
  });
});

export const offeredCoursesControllers = {
  createOfferedCourses,
  updateOfferedCourse,
};
