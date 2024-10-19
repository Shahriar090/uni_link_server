import { NextFunction, Request, Response } from 'express';
import { studentServices } from './student.services';

// get all students

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await studentServices.getAllStudentsFromDb();
    res.status(200).json({
      success: true,
      message: 'All Students Retrieved Successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get a single student
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.getSingleStudentFromDb(studentId);
    res.status(200).json({
      success: true,
      message: 'Student Retrieved Successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// delete a student
const deleteAStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.deleteStudentFromDb(studentId);
    res.status(200).json({
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
