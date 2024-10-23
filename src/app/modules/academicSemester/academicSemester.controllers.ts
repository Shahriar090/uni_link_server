import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { academicSemesterServices } from './academicSemester.services';
import httpStatus from 'http-status-codes';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.createAcademicSemesterIntoDb(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Created Successfully',
    data: result,
  });
});

// get all academic semester
const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemesterFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Semesters Retrieved Successfully',
    data: result,
  });
});

// get an academic semester
const getASingleAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getSingleAcademicSemesterFromDb(
    req.params.semesterId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Retrieved Successfully',
    data: result,
  });
});

// update a academic semester
const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await academicSemesterServices.updateAcademicSemesterIntoDb(
    semesterId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Updated Successfully',
    data: result,
  });
});

export const academicSemesterControllers = {
  createAcademicSemester,
  getASingleAcademicSemester,
  getAllAcademicSemester,
  updateAcademicSemester,
};
