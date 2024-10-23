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

academicSemesterRouter
  .route('/:semesterId')
  .get(academicSemesterControllers.getASingleAcademicSemester);

export const academicSemesterRoutes = academicSemesterRouter;
