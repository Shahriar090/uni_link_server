import { TStudent } from './student.interface';
import { Student } from './student.model';

// create student
const createStudentIntoDb = async (studentInfo: TStudent) => {
  // static method
  if (await Student.isUserExist(studentInfo.id)) {
    throw new Error('User Already Exist!');
  }
  const newStudent = await Student.create(studentInfo);
  return newStudent;
  // instance method
  // const newStudent = new Student(studentInfo);
  // const existedUser = await newStudent.isUserExists(newStudent.id);
  // if (existedUser) {
  //   throw new Error('User Already Exist!');
  // }
  // const result = await newStudent.save();
  // return result;
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

// delete a student
const deleteStudentFromDb = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};
export const studentServices = {
  createStudentIntoDb,
  getAllStudentsFromDb,
  getSingleStudentFromDb,
  deleteStudentFromDb,
};
