import AppError from '../../errors/appError';
import { OfferedCourses } from '../offeredCourses/offeredCourses.model';
import { Student } from '../student/student.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import httpStatusCodes from 'http-status-codes';
import EnrolledCourse from './enrolledCourse.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';

// create enrolled course into db
const createEnrolledCourseIntoDb = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;
  // Check if the offered course is available
  const isOfferedCourseExists = await OfferedCourses.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(
      httpStatusCodes.NOT_FOUND,
      'Offered Course Not Found',
      '',
    );
  }

  // check if the max capacity of the course is reached
  if (isOfferedCourseExists?.maxCapacity <= 0) {
    throw new AppError(httpStatusCodes.CONFLICT, 'Room Capacity is Full.!', '');
  }
  const student = await Student.findOne({ id: userId }, { _id: 1 });
  if (!student) {
    throw new AppError(httpStatusCodes.NOT_FOUND, 'Student Not Found', '');
  }

  // Check if the student is already enrolled in the course
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatusCodes.CONFLICT,
      'Student Already Enrolled',
      '',
    );
  }

  // check total credit exceeds max credit
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists?.semesterRegistration,
  ).select('maxCredit');

  const maxCredit = semesterRegistration?.maxCredit;

  // check if total enrolled credits + new enrolled course credit exceeds max credit

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCoursesData',
      },
    },
    {
      $unwind: '$enrolledCoursesData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCoursesData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);
  const course = await Course.findById(isOfferedCourseExists?.course);

  const currentCredit = course?.credits;

  const totalCredits =
    enrolledCourses?.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
  console.log(totalCredits);

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(
      httpStatusCodes.CONFLICT,
      'You Have Exceeded The Maximum Credit Limit',
      '',
    );
  }

  // start transaction
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // create the enrolled course
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists?.semesterRegistration,
          academicSemester: isOfferedCourseExists?.academicSemester,
          academicFaculty: isOfferedCourseExists?.academicFaculty,
          academicDepartment: isOfferedCourseExists?.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists?.course,
          student: student._id,
          faculty: isOfferedCourseExists?.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        httpStatusCodes.BAD_REQUEST,
        'Course Enrollment Failed',
        '',
      );
    }

    // decrement the max capacity of the course
    const maxCapacity = isOfferedCourseExists?.maxCapacity;
    await OfferedCourses.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      '',
    );
  }
};

// update enrolled course
const updateEnrolledCourseIntoDb = async (
  payload: Partial<TEnrolledCourse>,
) => {};

export const enrolledCourseServices = {
  createEnrolledCourseIntoDb,
  updateEnrolledCourseIntoDb,
};
