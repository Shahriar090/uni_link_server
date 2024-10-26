import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { academicFacultyServices } from './academicFaculty.services';
import httpStatus from 'http-status-codes';

// create
const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await academicFacultyServices.createAcademicFacultyIntoDb(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty Created Successfully',
    data: result,
  });
});

// get all
const getAllAcademicFaculties = catchAsync(async (re, res) => {
  const result = await academicFacultyServices.getAllAcademicFacultiesFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Faculties Retrieved Successfully',
    data: result,
  });
});

const academicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
};
