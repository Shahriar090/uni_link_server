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
  const result = await courseServices.getAllCoursesFromDb(req.query);
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

// update a course

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.updateCourseIntoDb(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Updated Successfully',
    data: result,
  });
});

// update => assign faculty
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await courseServices.assignFacultiesWithCourseIntoDb(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Assigned Successfully',
    data: result,
  });
});

// get faculties of a specific course
const getFacultiesWithCourse = catchAsync(async (req, res) => {
  const result = await courseServices.getFacultiesWithCourseFromDb(
    req.params.courseId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties Retrieved Successfully',
    data: result,
  });
});

// delete faculty from course
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await courseServices.removeFacultiesFromCourseFromDb(
    courseId,
    faculties,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Removed Successfully',
    data: result,
  });
});

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
  updateCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse,
  deleteCourse,
  getFacultiesWithCourse,
};
