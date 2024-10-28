import express from 'express';
import { studentControllers } from './student.controllers';
const studentRouter = express.Router();

studentRouter.route('/get-students').get(studentControllers.getAllStudents);
studentRouter.route('/:studentId').get(studentControllers.getSingleStudent);
studentRouter.route('/:studentId').delete(studentControllers.deleteAStudent);

export const studentRoutes = studentRouter;
