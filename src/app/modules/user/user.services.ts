import { TStudent } from '../student/student.interface';
import { User } from './user.model';

// create student
const createStudentIntoDb = async (studentInfo: TStudent) => {
  // static method
  //   if (await Student.isUserExist(studentInfo.id)) {
  //     throw new Error('User Already Exist!');
  //   }
  const newStudent = await User.create(studentInfo);
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

export const userServices = { createStudentIntoDb };
