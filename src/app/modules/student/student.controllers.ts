import { RequestHandler } from 'express';
import { studentServices } from './student.services';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

// get all students

const getAllStudents: RequestHandler = async (req, res, next) => {
  try {
    const result = await studentServices.getAllStudentsFromDb();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Students Retrieved Successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get a single student
const getSingleStudent: RequestHandler = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.getSingleStudentFromDb(studentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Retrieved Successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// delete a student
const deleteAStudent: RequestHandler = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.deleteStudentFromDb(studentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Deleted Successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteAStudent,
};
