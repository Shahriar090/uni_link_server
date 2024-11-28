import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { semesterRegistrationValidations } from './semesterRegistration.validations';
import { semesterRegistrationControllers } from './semesterRegistration.controllers';
const router = express.Router();

// create
router
  .route('/create-semester-registration')
  .post(
    validateRequest(
      semesterRegistrationValidations.createSemesterRegistrationValidationSchema,
    ),
    semesterRegistrationControllers.createSemesterRegistration,
  );

//   get all
router
  .route('/')
  .get(semesterRegistrationControllers.getAllSemesterRegistration);

//   get single
router
  .route('/:id')
  .get(semesterRegistrationControllers.getSingleSemesterRegistration);

//   update
router
  .route('/:id')
  .patch(
    validateRequest(
      semesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
    ),
    semesterRegistrationControllers.updateSemesterRegistration,
  );

export const semesterRegistrationRoutes = router;
