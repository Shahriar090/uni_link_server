import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/appError';
import httpStatus from 'http-status-codes';
import { User } from '../user/user.model';
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
const updateStudentIntoDb = async (id: string, payload: Partial<TStudent>) => {
  // separating primitive and non primitive data
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  // creating new object to store transformed data.
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };
  // name (non primitive)
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  //  guardian (non primitive)
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  // local guardian (non primitive)
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

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
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Delete Student', '');
  }
};
export const studentServices = {
  getAllStudentsFromDb,
  getSingleStudentFromDb,
  updateStudentIntoDb,
  deleteStudentFromDb,
};
