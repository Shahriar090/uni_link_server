import { TOfferedCourses } from './offeredCourses.interface';
import { OfferedCourses } from './offeredCourses.model';

// create
const createOfferedCourseIntoDb = async (payload: TOfferedCourses) => {
  const result = await OfferedCourses.create(payload);
  return result;
};

export const offeredCoursesServices = { createOfferedCourseIntoDb };
