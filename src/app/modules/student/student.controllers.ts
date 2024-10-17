import { Request, Response } from 'express';
import { studentServices } from './student.services';
import studentValidationSchema from './student.validation';

// create a student
const createStudent = async (req: Request, res: Response) => {
  try {
    const studentInfo = req.body.student;
    const zodParsedData = studentValidationSchema.parse(studentInfo);
    const result = await studentServices.createStudentIntoDb(zodParsedData);
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

// get all students

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await studentServices.getAllStudentsFromDb();
    res.status(200).json({
      success: true,
      message: 'All Students Retrieved Successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Students Retrieving Failed',
      data: {},
    });
  }
};

// get a single student
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.getSingleStudentFromDb(studentId);
    res.status(200).json({
      success: true,
      message: 'Student Retrieved Successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Student Retrieving Failed',
      data: {},
    });
  }
};

export const studentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
