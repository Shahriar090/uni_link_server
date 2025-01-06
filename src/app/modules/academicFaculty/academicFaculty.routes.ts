import express from 'express';
import { academicFacultyControllers } from './academicFaculty.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { academicFacultyValidations } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const academicFacultyRouter = express.Router();

//create
academicFacultyRouter
  .route('/create-academic-faculty')
  .post(
    auth(USER_ROLES.Super_Admin, USER_ROLES.Admin),
    validateRequest(
      academicFacultyValidations.createAcademicFacultyValidationSchema,
    ),
    academicFacultyControllers.createAcademicFaculty,
  );

//get all
academicFacultyRouter
  .route('/')
  .get(
    auth(USER_ROLES?.Admin),
    academicFacultyControllers.getAllAcademicFaculties,
  );

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
