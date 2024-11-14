import { catchAsync } from '../../utils/catchAsync';
import httpStatus from 'http-status-codes';
import { courseServices } from './course.services';
import { sendResponse } from '../../utils/sendResponse';

// create course
const createCourse = catchAsync(async (req, res) => {
  const result = await courseServices.createCourseIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Created Successfully',
    data: result,
  });
});

// get all course
const getAllCourses = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCoursesFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Courses Retrieved Successfully',
    data: result,
  });
});

// get single course
const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getSingleCourseFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Retrieved Successfully',
    data: result,
  });
});

// TODO => Implement Update course

// delete a course
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.deleteCourseFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Deleted Successfully',
    data: result,
  });
});

export const courseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
};