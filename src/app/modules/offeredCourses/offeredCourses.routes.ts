import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { offeredCoursesValidations } from './offeredCourses.validations';
import { offeredCoursesControllers } from './offeredCourses.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

// create
router
  .route('/create-offered-course')
  .post(
    auth(USER_ROLES.Admin, USER_ROLES.Admin),
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
