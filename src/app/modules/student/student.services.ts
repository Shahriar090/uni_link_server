import { TStudent } from './student.interface';
import { StudentModel } from './student.model';

// create student
const createStudentIntoDb = async (student: TStudent) => {
  const result = await StudentModel.create(student);
  return result;
};

// get all students
const getAllStudentsFromDb = async () => {
  const result = await StudentModel.find();
  return result;
};

// get a single student
const getSingleStudentFromDb = async (id: string) => {
  const result = await StudentModel.findOne({ id });
  return result;
};
export const studentServices = {
  createStudentIntoDb,
  getAllStudentsFromDb,
  getSingleStudentFromDb,
};
