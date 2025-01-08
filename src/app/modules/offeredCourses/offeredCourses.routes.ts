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

// get all
router
  .route('/')
  .get(
    auth(USER_ROLES.Super_Admin, USER_ROLES.Admin),
    offeredCoursesControllers.getAllOfferedCourses,
  );

// get single
router
  .route('/:id')
  .get(
    auth(
      USER_ROLES.Super_Admin,
      USER_ROLES.Admin,
      USER_ROLES.Faculty,
      USER_ROLES.Student,
    ),
    offeredCoursesControllers.getSingleOfferedCourse,
  );

// my offered courses route
router
  .route('/my-offered-courses')
  .get(auth(USER_ROLES.Student), offeredCoursesControllers.getMyOfferedCourses);

// update
router
  .route('/:id')
  .patch(
    auth(USER_ROLES.Super_Admin, USER_ROLES.Admin),
    validateRequest(
      offeredCoursesValidations.updateOfferedCoursesValidationSchema,
    ),
    offeredCoursesControllers.updateOfferedCourse,
  );

export const offeredCoursesRoutes = router;
