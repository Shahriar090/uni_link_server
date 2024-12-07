import AppError from '../../errors/appError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { Course } from '../course/course.model';
import Faculty from '../faculty/faculty.model';
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
    section,
    faculty,
  } = payload;

  // check if the semester registration exists
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration Not Found!',
      '',
    );
  }

  const academicSemester = isSemesterRegistrationExists?.academicSemester;
  // check if the academic faculty exists
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty Not Found!', '');
  }

  // check if the academic department exists
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department Not Found!',
      '',
    );
  }

  // check if the course exists
  const isCourseExists = await Course.findById(course);

  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course Not Found!', '');
  }

  // check if the faculty exists
  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not Found!', '');
  }

  // check if the department is belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExists?.name} Does Not Belong To This ${isAcademicFacultyExists?.name}`,
      '',
    );
  }

  // check if the same offered course same section in same registered semester

  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourses.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Offered Course With Same Section Already Exists!',
      '',
    );
  }
  const result = await OfferedCourses.create({ ...payload, academicSemester });
  return result;
};

export const offeredCoursesServices = { createOfferedCourseIntoDb };
