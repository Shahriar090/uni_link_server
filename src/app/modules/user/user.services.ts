import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateFacultyId, generateStudentId } from './user.utils';
import AppError from '../../errors/appError';
import httpStatus from 'http-status-codes';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import Faculty from '../faculty/faculty.model';

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

// create faculty
const createFacultyIntoDb = async (password: string, payload: TFaculty) => {
  console.log('payload', payload);
  let userData: Partial<TUser> = {};
  userData.password = password || config.default_password;
  userData.role = 'Faculty';

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Academic Department Not Found',
      '',
    );
  }

  // start session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generateFacultyId();

    // transaction 1
    const newUser = await User.create([userData], { session });

    // creating faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Create User', '');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference id

    // creating faculty => transaction 2
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed To Create Faculty',
        '',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
export const userServices = { createStudentIntoDb, createFacultyIntoDb };
