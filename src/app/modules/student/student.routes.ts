import express from 'express';
import { studentControllers } from './student.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const studentRouter = express.Router();

// get all student
studentRouter.route('/').get(studentControllers.getAllStudents);

// get single student
studentRouter
  .route('/:studentId')
  .get(
    auth(USER_ROLES.Admin, USER_ROLES.Faculty),
    studentControllers.getSingleStudent,
  );

// update student
studentRouter
  .route('/:id')
  .patch(
    validateRequest(studentValidations.updateStudentValidationSchema),
    studentControllers.updateStudent,
  );

// delete student
studentRouter.route('/:id').delete(studentControllers.deleteAStudent);

export const studentRoutes = studentRouter;
