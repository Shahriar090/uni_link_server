import express from 'express';
import { studentControllers } from './student.controllers';
const studentRouter = express.Router();

studentRouter.route('/create-student').post(studentControllers.createStudent);

export const studentRoutes = studentRouter;
