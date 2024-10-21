import express from 'express';
import { userControllers } from './user.controllers';
import { studentValidations } from '../student/student.validation';
import { validateRequest } from '../../middlewares/validateRequest';
const userRouter = express.Router();

userRouter
  .route('/create-student')
  .post(
    validateRequest(studentValidations.createStudentValidationSchema),
    userControllers.createStudent,
  );

export const userRoutes = userRouter;
