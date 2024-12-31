import express from 'express';
import { studentControllers } from './student.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const studentRouter = express.Router();

studentRouter.route('/').get(studentControllers.getAllStudents);
studentRouter
  .route('/:studentId')
  .get(
    auth(USER_ROLES.Admin, USER_ROLES.Faculty, USER_ROLES.Student),
    studentControllers.getSingleStudent,
  );
studentRouter
  .route('/:id')
  .patch(
    validateRequest(studentValidations.updateStudentValidationSchema),
    studentControllers.updateStudent,
  );
studentRouter.route('/:id').delete(studentControllers.deleteAStudent);

export const studentRoutes = studentRouter;
