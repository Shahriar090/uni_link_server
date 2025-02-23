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
import QueryBuilder from '../../builder/QueryBuilder';
import { Student } from '../student/student.model';

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
const getAllOfferedCoursesFromDb = async (query: Record<string, unknown>) => {
  const offeredCoursesQuery = new QueryBuilder(OfferedCourses.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCoursesQuery.modelQuery;
  const meta = await offeredCoursesQuery.countTotal();
  return { meta, result };
};

// get single
const getSingleOfferedCourseFromDb = async (id: string) => {
  const result = await OfferedCourses.findById(id);
  return result;
};

// get my offered courses
const getMyOfferedCoursesFromDb = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // setup pagination
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  // find the student
  const student = await Student.findOne({ id: userId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Found.!', '');
  }

  // find the ongoing semester
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  );

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Current Ongoing Semester Was Founded',
      '',
    );
  }

  // pagination query
  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  // aggregate query
  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: student?.academicFaculty,
        academicDepartment: student?.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester?._id,
          currentStudent: student?._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student?._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCoursesIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },

    {
      $addFields: {
        isPreRequisiteFullFilled: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCoursesIds',
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isPreRequisiteFullFilled: true,
        // isAlreadyEnrolled: false,
      },
    },
  ];

  const result = await OfferedCourses.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);

  const total = (await OfferedCourses.aggregate(aggregationQuery)).length;
  const totalPage = Math.ceil(result.length / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};

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
