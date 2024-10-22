import express from 'express';
import { academicSemesterControllers } from './academicSemester.controllers';
const academicSemesterRouter = express.Router();

academicSemesterRouter
  .route('/create-academic-semester')
  .post(academicSemesterControllers.createAcademicSemester);

export const academicSemesterRoutes = academicSemesterRouter;
