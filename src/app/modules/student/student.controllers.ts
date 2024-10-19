import { Request, Response } from 'express';
import { studentServices } from './student.services';

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

// delete a student
const deleteAStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.deleteStudentFromDb(studentId);
    res.status(200).json({
      success: true,
      message: 'Student Deleted Successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Student Delete Operation Failed',
      data: {},
    });
  }
};

export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteAStudent,
};
