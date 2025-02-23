import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { adminServices } from './admin.services';
import httpStatus from 'http-status-codes';

// get all admins
const getAllAdmins = catchAsync(async (req, res) => {
  const result = await adminServices.getAllAdminsFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Admins Retrieved Successfully',
    data: result,
  });
});

// get single admins
const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getSingleAdminFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Retrieved Successfully',
    data: result,
  });
});

// update admin
const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;

  const result = await adminServices.updateAdminIntoDb(id, admin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Updated Successfully',
    data: result,
  });
});

// delete admin
const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.deleteAdminFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Deleted Successfully',
    data: result,
  });
});

export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
