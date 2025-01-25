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

// get all
const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await offeredCoursesServices.getAllOfferedCoursesFromDb(
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Offered Courses Are Retrieved Successfully',
    data: result,
  });
});

// get single
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await offeredCoursesServices.getSingleOfferedCourseFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Retrieved Successfully',
    data: result,
  });
});

// get my offered courses
const getMyOfferedCourses = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await offeredCoursesServices.getMyOfferedCoursesFromDb(
    userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Offered Courses Are Retrieved Successfully',
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
  getAllOfferedCourses,
  getSingleOfferedCourse,
  getMyOfferedCourses,
};
