import AppError from '../../errors/appError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { Course } from '../course/course.model';
import Faculty from '../faculty/faculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourses } from './offeredCourses.interface';
import { OfferedCourses } from './offeredCourses.model';
import httpStatus from 'http-status-codes';
import { hasTimeConflict } from './offeredCourses.utils';
import { JwtPayload } from 'jsonwebtoken';

// create
const createOfferedCourseIntoDb = async (payload: TOfferedCourses) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
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

  // get the schedules of faculties
  // Resolving time conflicts to prevent assigning multiple tasks to a faculty member at the same time on a single day

  const assignedSchedules = await OfferedCourses.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  // new schedules
  const newSchedules = { days, startTime, endTime };

  if (hasTimeConflict(assignedSchedules, newSchedules)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This Faculty Is Not Available At That Time! Choose Another Time Or Day.',
      '',
    );
  }
  const result = await OfferedCourses.create({ ...payload, academicSemester });
  return result;
};

// get all
const getAllOfferedCoursesFromDb = async () => {
  const result = await OfferedCourses.find();
  return result;
};

// get single
const getSingleOfferedCourseFromDb = async (id: string) => {
  const result = await OfferedCourses.findById(id);
  return result;
};

// get my offered courses
const getMyOfferedCoursesFromDb = async (userId: JwtPayload) => {};

// update
const updateOfferedCourseIntoDb = async (
  id: string,
  payload: Pick<TOfferedCourses, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;
  // check if offered course exist or not
  const isOfferedCourseExists = await OfferedCourses.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Offered Course Found With This Id!',
      '',
    );
  }

  // check if the faculty exists or not
  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Faculty Found With This Id!',
      '',
    );
  }

  // checking the registered semester's status
  const semesterRegistration = isOfferedCourseExists?.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You Cannot Update This Offered Course As It Is ${semesterRegistrationStatus?.status}`,
      '',
    );
  }

  // validation for time conflicts
  const assignedSchedules = await OfferedCourses.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  });

  const newSchedules = { days, startTime, endTime };

  if (hasTimeConflict(assignedSchedules, newSchedules)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This Faculty Is Not Available At That Time! Choose Another Time Or Day.',
      '',
    );
  }

  const result = await OfferedCourses.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const offeredCoursesServices = {
  createOfferedCourseIntoDb,
  updateOfferedCourseIntoDb,
  getAllOfferedCoursesFromDb,
  getSingleOfferedCourseFromDb,
  getMyOfferedCoursesFromDb,
};
