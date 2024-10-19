import express from 'express';
import { studentControllers } from './student.controllers';
const studentRouter = express.Router();

studentRouter.route('/get-students').get(studentControllers.getAllStudents);
studentRouter
  .route('/get-student/:studentId')
  .get(studentControllers.getSingleStudent);
studentRouter
  .route('/delete-student/:studentId')
  .delete(studentControllers.deleteAStudent);

export const studentRoutes = studentRouter;
