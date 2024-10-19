import { NextFunction, Request, Response } from 'express';
import { userServices } from './user.services';

// create a student
const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student } = req.body;
    // const zodParsedData = studentValidationSchema.parse(student);
    const result = await userServices.createStudentIntoDb(password, student);
    res.status(200).json({
      success: true,
      message: 'Student Created Successfully',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const userControllers = { createStudent };
