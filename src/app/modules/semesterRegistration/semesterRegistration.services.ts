import AppError from '../../errors/appError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import httpStatus from 'http-status-codes';
import { SemesterRegistration } from './semesterRegistration.model';
// create
const createSemesterRegistrationIntoDb = async (
  payload: TSemesterRegistration,
) => {
  // check if the semester already exist
  const academicSemester = payload?.academicSemester;

  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Academic Semester Found', '');
  }

  // check if the semester already register before

  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This Semester Is Already Registered',
      '',
    );
  }

  // creating new semester
  const result = await SemesterRegistration.create(payload);
  return result;
};

// get all
const getAllSemesterRegistrationFromDb = async () => {};

// get single
const getSingleSemesterRegistrationFromDb = async () => {};

// update
const updateSemesterRegistrationIntoDb = async () => {};

export const semesterRegistrationServices = {
  createSemesterRegistrationIntoDb,
  getAllSemesterRegistrationFromDb,
  getSingleSemesterRegistrationFromDb,
  updateSemesterRegistrationIntoDb,
};
