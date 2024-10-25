import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

// create student
const createStudentIntoDb = async (password: string, payload: TStudent) => {
  //   create an user object
  let userInfo: Partial<TUser> = {};

  //   if no password given use default password
  userInfo.password = password || (config.default_password as string);

  //   set the user role
  userInfo.role = 'Student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  //   set manually generated id (temporary)
  userInfo.id = await generateStudentId(admissionSemester!);

  //   creating a user
  const newUser = await User.create(userInfo);

  //   creating a student

  if (Object.keys(newUser).length) {
    // set id and _id as user
    payload.id = newUser.id; //embedding id
    payload.user = newUser._id; //reference id

    // creating new student
    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const userServices = { createStudentIntoDb };
