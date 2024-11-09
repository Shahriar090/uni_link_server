import mongoose, { mongo } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { AdminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../../errors/appError';
import httpStatus from 'http-status-codes';
import { User } from '../user/user.model';

// get  all admins
const getAllAdminsFromDb = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  return result;
};

// get a single admin
const getSingleAdminFromDb = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

// update a admin
const updateAdminIntoDb = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

// delete a admin
const deleteAdminFromDb = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Delete Admin', '');
    }

    // get user id from deleted admin
    const userId = deletedAdmin.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed To Delete User', '');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
export const adminServices = {
  getAllAdminsFromDb,
  getSingleAdminFromDb,
  updateAdminIntoDb,
  deleteAdminFromDb,
};
