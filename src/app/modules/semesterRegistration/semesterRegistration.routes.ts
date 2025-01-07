import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { semesterRegistrationValidations } from './semesterRegistration.validations';
import { semesterRegistrationControllers } from './semesterRegistration.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

// create
router
  .route('/create-semester-registration')
  .post(
    auth(USER_ROLES.Admin, USER_ROLES.Super_Admin),
    validateRequest(
      semesterRegistrationValidations.createSemesterRegistrationValidationSchema,
    ),
    semesterRegistrationControllers.createSemesterRegistration,
  );

//   get all
router
  .route('/')
  .get(
    auth(
      USER_ROLES.Admin,
      USER_ROLES.Super_Admin,
      USER_ROLES.Faculty,
      USER_ROLES.Student,
    ),
    semesterRegistrationControllers.getAllSemesterRegistration,
  );

//   get single
router
  .route('/:id')
  .get(
    auth(
      USER_ROLES.Admin,
      USER_ROLES.Super_Admin,
      USER_ROLES.Faculty,
      USER_ROLES.Student,
    ),
    semesterRegistrationControllers.getSingleSemesterRegistration,
  );

//   update
router
  .route('/:id')
  .patch(
    auth(USER_ROLES.Admin, USER_ROLES.Super_Admin),
    validateRequest(
      semesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
    ),
    semesterRegistrationControllers.updateSemesterRegistration,
  );

export const semesterRegistrationRoutes = router;
