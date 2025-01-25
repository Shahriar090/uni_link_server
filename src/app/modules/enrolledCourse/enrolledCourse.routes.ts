import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { enrolledCourseValidations } from './enrolledCourse.validations';
import { enrolledCourseControllers } from './enrolledCourse.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

// create enrolled course
router
  .route('/create-enrolled-course')
  .post(
    auth(USER_ROLES.Student),
    validateRequest(
      enrolledCourseValidations.createEnrolledCourseValidationSchema,
    ),
    enrolledCourseControllers.createEnrolledCourse,
  );

// update enrolled course
router
  .route('/update-enrolled-course-marks')
  .patch(
    auth(USER_ROLES.Faculty),
    validateRequest(
      enrolledCourseValidations.updateEnrolledCourseValidationSchema,
    ),
    enrolledCourseControllers.updateEnrolledCourseMarks,
  );

// get my enrolled courses
router
  .route('/my-enrolled-courses')
  .get(
    auth(USER_ROLES.Student),
    enrolledCourseControllers.getMyEnrolledCourses,
  );
//   --------------
export const EnrolledCourseRoutes = router;
