import express from 'express';
import { userControllers } from './user.controllers';
import { studentValidations } from '../student/student.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
const userRouter = express.Router();

userRouter
  .route('/create-student')
  .post(
    validateRequest(studentValidations.createStudentValidationSchema),
    userControllers.createStudent,
  );

userRouter
  .route('/create-faculty')
  .post(
    validateRequest(facultyValidations.createFacultyValidationSchema),
    userControllers.createFaculty,
  );

export const userRoutes = userRouter;
