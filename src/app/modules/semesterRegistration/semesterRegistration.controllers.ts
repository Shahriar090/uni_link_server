import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';

// create
const createSemesterRegistration = catchAsync(async (req, res) => {});

// get all
const getAllSemesterRegistration = catchAsync(async (req, res) => {});

// get single
const getSingleSemesterRegistration = catchAsync(async (req, res) => {});

// update
const updateSemesterRegistration = catchAsync(async (req, res) => {});

export const semesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
