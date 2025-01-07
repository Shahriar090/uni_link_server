import express from 'express';
import { academicSemesterControllers } from './academicSemester.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const academicSemesterRouter = express.Router();

academicSemesterRouter
  .route('/create-academic-semester')
  .post(
    auth(USER_ROLES.Super_Admin, USER_ROLES.Admin),
    validateRequest(
      academicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    academicSemesterControllers.createAcademicSemester,
  );

// get all academic semester
academicSemesterRouter
  .route('/')
  .get(
    auth(
      USER_ROLES.Super_Admin,
      USER_ROLES.Admin,
      USER_ROLES.Faculty,
      USER_ROLES.Student,
    ),
    academicSemesterControllers.getAllAcademicSemester,
  );

// get a single academic semester
academicSemesterRouter
  .route('/:semesterId')
  .get(
    auth(
      USER_ROLES.Super_Admin,
      USER_ROLES.Admin,
      USER_ROLES.Faculty,
      USER_ROLES.Student,
    ),
    academicSemesterControllers.getASingleAcademicSemester,
  );

// update academic semester
academicSemesterRouter
  .route('/:semesterId')
  .patch(
    auth(USER_ROLES.Super_Admin, USER_ROLES.Admin),
    validateRequest(
      academicSemesterValidations.updateAcademicSemesterValidationSchema,
    ),
    academicSemesterControllers.updateAcademicSemester,
  );

export const academicSemesterRoutes = academicSemesterRouter;
