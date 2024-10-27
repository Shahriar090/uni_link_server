import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { academicDepartmentServices } from './academicDepartment.services';
import httpStatus from 'http-status-codes';

// create
const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.createAcademicDepartmentIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Created Successfully',
    data: result,
  });
});

// get all
const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await academicDepartmentServices.getAllAcademicDepartmentsFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Departments Retrieved Successfully',
    data: result,
  });
});

// get single
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await academicDepartmentServices.getSingleAcademicDepartmentFromDb(
      departmentId,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Retrieved Successfully',
    data: result,
  });
});

// update
const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await academicDepartmentServices.updateAcademicDepartmentIntoDb(
      departmentId,
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Updated Successfully',
    data: result,
  });
});

export const academicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
