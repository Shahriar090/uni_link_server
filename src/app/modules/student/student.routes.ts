import express from 'express';
import { studentControllers } from './student.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';

const studentRouter = express.Router();

studentRouter.route('/').get(studentControllers.getAllStudents);
studentRouter.route('/:studentId').get(studentControllers.getSingleStudent);
studentRouter
  .route('/:id')
  .patch(
    validateRequest(studentValidations.updateStudentValidationSchema),
    studentControllers.updateStudent,
  );
studentRouter.route('/:id').delete(studentControllers.deleteAStudent);

export const studentRoutes = studentRouter;
