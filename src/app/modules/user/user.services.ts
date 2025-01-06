import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../errors/appError';
import httpStatus from 'http-status-codes';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import Faculty from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { IUser } from './user.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

// create student
const createStudentIntoDb = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  //   create an user object
  let userInfo: Partial<IUser> = {};

  //   if no password given use default password
  userInfo.password = password || (config.default_password as string);

  //   set the user role
  userInfo.role = 'Student';
  // set user email
  userInfo.email = payload.email;

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  // find academic department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department Not Found.!',
      '',
    );
  }

  payload.academicFaculty = academicDepartment.academicFaculty;
  // implementing transaction and rollback to create user and student.
  const session = await mongoose.startSession();
  try {
    // first transaction
    session.startTransaction();
    //  generating id dynamically
    userInfo.id = await generateStudentId(admissionSemester!);

    if (file) {
      // image name and image path
      const imageName = `${userInfo.id}-${payload?.name?.firstName}-${payload?.name?.middleName}-${payload?.name?.lastName}`;
      const imagePath = file.path;

      // send image to cloudinary
      const userProfileImg = await sendImageToCloudinary(imageName, imagePath);
      const { secure_url } = userProfileImg;
      payload.profileImage = secure_url as string;
    }
    //   creating a user
    const newUser = await User.create([userInfo], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User Creation Failed', '');
    } else {
      // set id, user reference id and image url
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
const createFacultyIntoDb = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  let userData: Partial<IUser> = {};
  userData.password = password || config.default_password;

  userData.role = 'Faculty';
  userData.email = payload.email;

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

    if (file) {
      // image name and image path
      const imageName = `${userData.id}-${payload?.name?.firstName}-${payload?.name?.middleName}-${payload?.name?.lastName}`;
      const imagePath = file.path;

      // send image to cloudinary
      const userProfileImg = await sendImageToCloudinary(imageName, imagePath);
      const { secure_url } = userProfileImg;
      payload.profileImage = secure_url as string;
    }

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

// create admin
const createAdminIntoDb = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  const userData: Partial<IUser> = {};

  userData.password = password || config.default_password;

  userData.role = 'Admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateAdminId();

    if (file) {
      // image name and image path
      const imageName = `${userData.id}-${payload?.name?.firstName}-${payload?.name?.middleName}-${payload?.name?.lastName}`;
      const imagePath = file.path;

      // send image to cloudinary
      const userProfileImg = await sendImageToCloudinary(imageName, imagePath);
      const { secure_url } = userProfileImg;
      payload.profileImage = secure_url as string;
    }
    // create a user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Create User', '');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference id

    // create a admin
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Create Admin', '');
    }

    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// get me
const getMe = async (userId: string, userRole: string) => {
  let result = null;

  if (userRole === 'Student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (userRole === 'Faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }
  if (userRole === 'Admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  return result;
};

// change status
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true },
  );
  return result;
};
export const userServices = {
  createStudentIntoDb,
  createFacultyIntoDb,
  createAdminIntoDb,
  getMe,
  changeStatus,
};
