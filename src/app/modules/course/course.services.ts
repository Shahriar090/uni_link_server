import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constants';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import httpStatus from 'http-status-codes';
import AppError from '../../errors/appError';

// create course
const createCourseIntoDb = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

// get all courses
const getAllCoursesFromDb = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};

// get single course
const getSingleCourseFromDb = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

// update a course
const updateCourseIntoDb = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...remainingCourseData } = payload;

  // session start

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedRemainingData = await Course.findByIdAndUpdate(
      id,
      remainingCourseData,
      { new: true, runValidators: true, session },
    );

    if (!updatedRemainingData) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Update Course', '');
    }

    // pre-requisite courses update logics
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the removed/deleted pre-requisite courses
      const deletedPreRequisites = preRequisiteCourses
        ?.filter((elem) => elem?.course && elem?.isDeleted)
        .map((item) => item.course);

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        { new: true, runValidators: true, session },
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed To Update Course',
          '',
        );
      }

      // filter out the new pre-requisite courses
      const newPreRequisites = preRequisiteCourses?.filter(
        (elem) => elem?.course && !elem?.isDeleted,
      );

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        { new: true, runValidators: true, session },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed To Update Course',
          '',
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Update Course', '');
  }
};

// delete a course
const deleteCourseFromDb = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleTed: true },
    { new: true },
  );
  return result;
};
export const courseServices = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getSingleCourseFromDb,
  updateCourseIntoDb,
  deleteCourseFromDb,
};
