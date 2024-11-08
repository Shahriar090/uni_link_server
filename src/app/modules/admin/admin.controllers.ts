import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { adminServices } from './admin.services';
import httpStatus from 'http-status-codes';

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await adminServices.getAllAdminsFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins Retrieved Successfully',
    data: result,
  });
});

export const adminControllers = {
  getAllAdmins,
};
