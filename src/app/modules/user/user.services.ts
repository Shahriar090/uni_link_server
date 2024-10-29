import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/appError';
import httpStatus from 'http-status-codes';

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

  // implementing transaction and rollback to create user and student.
  const session = await mongoose.startSession();
  try {
    // first transaction
    session.startTransaction();
    //  generating id dynamically
    userInfo.id = await generateStudentId(admissionSemester!);

    //   creating a user
    const newUser = await User.create([userInfo], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User Creation Failed', '');
    } else {
      // set id and _id as user
      payload.id = newUser[0].id; //embedding id
      payload.user = newUser[0]._id; //reference id

      // creating new student
      // second transaction
      const newStudent = await Student.create([payload], { session });
      if (!newStudent.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Student Creation Failed',
          '',
        );
      }
      await session.commitTransaction();
      await session.endSession();
      return newStudent;
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Something Went Wrong While Creating Student',
      '',
    );
  }
};

export const userServices = { createStudentIntoDb };
