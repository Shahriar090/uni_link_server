import { TCourse } from './course.interface';
import { Course } from './course.model';

// create course
const createCourseIntoDb = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

// get all courses
const getAllCoursesFromDb = async () => {
  const result = await Course.find();
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
