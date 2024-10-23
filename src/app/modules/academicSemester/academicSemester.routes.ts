import express from 'express';
import { academicSemesterControllers } from './academicSemester.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';
const academicSemesterRouter = express.Router();

academicSemesterRouter
  .route('/create-academic-semester')
  .post(
    validateRequest(
      academicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    academicSemesterControllers.createAcademicSemester,
  );

// get all academic semester
academicSemesterRouter
  .route('/')
  .get(academicSemesterControllers.getAllAcademicSemester);

// get a single academic semester
academicSemesterRouter
  .route('/:semesterId')
  .get(academicSemesterControllers.getASingleAcademicSemester);

export const academicSemesterRoutes = academicSemesterRouter;
