import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/appError';
import httpStatus from 'http-status-codes';
import { User } from '../user/user.model';
import { SetProfilingLevelOptions } from 'mongodb';
import { TStudent } from './student.interface';
// get all students
const getAllStudentsFromDb = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });
  return result;
};

// get a single student
const getSingleStudentFromDb = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });
  return result;
};

// update a student
const updateStudentIntoDb = async (
  id: string,
  payload: Partial<TStudent>,
) => {};

// delete a student
const deleteStudentFromDb = async (id: string) => {
  // implementing transaction
  // starting session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // checking if he student exists
    const isStudentExist = await Student.findOne({ id });
    if (!isStudentExist) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This Student Does Not Exist.',
        '',
      );
    }

    // checking if the user exist
    const isUserExist = await User.findOne({ id });
    if (!isUserExist) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This User Does Not Exist.',
        '',
      );
    }
    // deleting student (soft delete)
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed To Delete Student',
        '',
      );
    }

    // deleting user (soft delete)
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Delete User', '');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
export const studentServices = {
  getAllStudentsFromDb,
  getSingleStudentFromDb,
  updateStudentIntoDb,
  deleteStudentFromDb,
};
