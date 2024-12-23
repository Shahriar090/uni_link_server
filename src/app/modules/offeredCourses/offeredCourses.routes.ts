import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { offeredCoursesValidations } from './offeredCourses.validations';
import { offeredCoursesControllers } from './offeredCourses.controllers';
const router = express.Router();

// create
router
  .route('/create-offered-course')
  .post(
    validateRequest(
      offeredCoursesValidations.createOfferedCoursesValidationSchema,
    ),
    offeredCoursesControllers.createOfferedCourses,
  );

// update
router
  .route('/:id')
  .patch(
    validateRequest(
      offeredCoursesValidations.updateOfferedCoursesValidationSchema,
    ),
    offeredCoursesControllers.updateOfferedCourse,
  );

export const offeredCoursesRoutes = router;
