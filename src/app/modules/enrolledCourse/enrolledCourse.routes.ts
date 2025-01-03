import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { EnrolledCourseValidations } from './enrolledCourse.validations';
import { EnrolledCourseControllers } from './enrolledCourse.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

// create enrolled course
router
  .route('/create-enrolled-course')
  .post(
    auth(USER_ROLES.Student),
    validateRequest(
      EnrolledCourseValidations.createEnrolledCourseValidationSchema,
    ),
    EnrolledCourseControllers.createEnrolledCourse,
  );

//   --------------
export const EnrolledCourseRoutes = router;
