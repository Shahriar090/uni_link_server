import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constants';
import { TCourse } from './course.interface';
import { Course } from './course.model';

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
  const result = await Course.findById(id);
  return result;
};

// TODO => Implement Update course

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
  deleteCourseFromDb,
};
