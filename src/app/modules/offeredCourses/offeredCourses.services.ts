import AppError from '../../errors/appError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourses } from './offeredCourses.interface';
import { OfferedCourses } from './offeredCourses.model';
import httpStatus from 'http-status-codes';

// create
const createOfferedCourseIntoDb = async (payload: TOfferedCourses) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;

  // check if the semester registration exist
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration Not Found!',
      '',
    );
  }
  const result = await OfferedCourses.create(payload);
  return result;
};

export const offeredCoursesServices = { createOfferedCourseIntoDb };
