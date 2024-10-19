import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

// create student
const createStudentIntoDb = async (password: string, studentInfo: TStudent) => {
  // static method
  //   if (await Student.isUserExist(studentInfo.id)) {
  //     throw new Error('User Already Exist!');
  //   }

  //   create an user object
  let userInfo: Partial<TUser> = {};

  //   if no password given use default password
  userInfo.password = password || (config.default_password as string);

  //   set the user role
  userInfo.role = 'Student';

  //   set manually generated id (temporary)
  userInfo.id = '2030100001';

  //   creating a user
  const newUser = await User.create(userInfo);

  //   creating a student

  if (Object.keys(newUser).length) {
    // set id and _id as user
    studentInfo.id = newUser.id; //embedding id
    studentInfo.user = newUser._id; //reference id

    // creating new student
    const newStudent = await Student.create(studentInfo);
    return newStudent;
  }

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
