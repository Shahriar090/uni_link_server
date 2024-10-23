import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDb = async (payload: TAcademicSemester) => {
  // checking if the semester name and code are matching together or not

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};

// get all academic semester from db
const getAllAcademicSemesterFromDb = async () => {
  const result = await AcademicSemester.find();
  return result;
};

// get a single academic semester from db
const getSingleAcademicSemesterFromDb = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

export const academicSemesterServices = {
  createAcademicSemesterIntoDb,
  getSingleAcademicSemesterFromDb,
  getAllAcademicSemesterFromDb,
};
