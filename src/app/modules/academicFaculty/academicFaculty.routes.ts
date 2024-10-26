import express from 'express';
import { academicFacultyControllers } from './academicFaculty.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { academicFacultyValidations } from './academicFaculty.validation';
const academicFacultyRouter = express.Router();
//create
academicFacultyRouter
  .route('/create-academic-faculty')
  .post(
    validateRequest(
      academicFacultyValidations.createAcademicFacultyValidationSchema,
    ),
    academicFacultyControllers.createAcademicFaculty,
  );

//get all
academicFacultyRouter
  .route('/')
  .get(academicFacultyControllers.getAllAcademicFaculties);

//get single
academicFacultyRouter
  .route('/:facultyId')
  .get(academicFacultyControllers.getSingleAcademicFaculty);

//update
academicFacultyRouter
  .route('/:facultyId')
  .patch(
    validateRequest(
      academicFacultyValidations.updateAcademicFacultyValidationSchema,
    ),
    academicFacultyControllers.updateAcademicFaculty,
  );

export const academicFacultyRoutes = academicFacultyRouter;
