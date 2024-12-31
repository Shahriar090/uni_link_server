import { userServices } from './user.services';
import httpStatus from 'http-status-codes';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/appError';

// create a student
const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;
  const result = await userServices.createStudentIntoDb(password, student);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Created Successfully',
    data: result,
  });
});

// create faculty

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  const result = await userServices.createFacultyIntoDb(password, facultyData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Created Successfully',
    data: result,
  });
});

// create admin
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;
  const result = await userServices.createAdminIntoDb(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Created Successfully',
    data: result,
  });
});

// get me
const getMe = catchAsync(async (req, res) => {
  const { userId, userRole } = req.user;
  const result = await userServices.getMe(userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Information Retrieved Successfully',
    data: result,
  });
});

// change status
const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status Changed Successfully',
    data: result,
  });
});

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
