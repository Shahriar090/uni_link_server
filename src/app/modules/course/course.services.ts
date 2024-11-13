import { Course } from './course.model';

// create course
const createCourseIntoDb = async () => {
  const result = await Course.create();
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
