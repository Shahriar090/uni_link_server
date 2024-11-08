import express from 'express';
import { userControllers } from './user.controllers';
import { studentValidations } from '../student/student.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';
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

userRouter
  .route('/create-admin')
  .post(
    validateRequest(adminValidations.createAdminValidationSchema),
    userControllers.createAdmin,
  );

export const userRoutes = userRouter;
