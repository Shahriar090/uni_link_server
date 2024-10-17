import { TStudent } from './student.interface';
import { Student } from './student.model';

// create student
const createStudentIntoDb = async (student: TStudent) => {
  const newStudent = new Student(student);
  const existedUser = await newStudent.isUserExists(newStudent.id);
  if (existedUser) {
    throw new Error('User Already Exist!');
  }
  const result = await newStudent.save();
  return result;
};

// get all students
const getAllStudentsFromDb = async () => {
  const result = await Student.find();
  return result;
};

// get a single student
const getSingleStudentFromDb = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};
export const studentServices = {
  createStudentIntoDb,
  getAllStudentsFromDb,
  getSingleStudentFromDb,
};
