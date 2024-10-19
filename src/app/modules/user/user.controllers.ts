import { Request, Response } from 'express';
import studentValidationSchema from '../student/student.validation';
import { userServices } from './user.services';

// create a student
const createStudent = async (req: Request, res: Response) => {
  try {
    const studentInfo = req.body.student;
    const zodParsedData = studentValidationSchema.parse(studentInfo);
    const result = await userServices.createStudentIntoDb(zodParsedData);
    res.status(200).json({
      success: true,
      message: 'Student Created Successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Student Creation Failed',
      error: error,
    });
  }
};

export const userControllers = { createStudent };
