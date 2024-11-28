import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { semesterRegistrationServices } from './semesterRegistration.services';
import { sendResponse } from '../../utils/sendResponse';

// create
const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await semesterRegistrationServices.createSemesterRegistrationIntoDb(
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration Successful',
    data: result,
  });
});

// get all
const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await semesterRegistrationServices.getAllSemesterRegistrationFromDb(
      req.query,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Semester Registration Retrieved Successfully',
    data: result,
  });
});

// get single
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await semesterRegistrationServices.getSingleSemesterRegistrationFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration Retrieved Successfully',
    data: result,
  });
});

// update
const updateSemesterRegistration = catchAsync(async (req, res) => {});

export const semesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
