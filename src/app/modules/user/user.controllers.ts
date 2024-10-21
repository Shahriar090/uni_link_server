import { RequestHandler } from 'express';
import { userServices } from './user.services';
import httpStatus from 'http-status-codes';
import { sendResponse } from '../../utils/sendResponse';

// create a student
const createStudent: RequestHandler = async (req, res, next) => {
  try {
    const { password, student } = req.body;
    // const zodParsedData = studentValidationSchema.parse(student);
    const result = await userServices.createStudentIntoDb(password, student);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Created Successfully',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const userControllers = { createStudent };
