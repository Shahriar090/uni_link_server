import express from 'express';
import { userControllers } from './user.controllers';
import { studentValidations } from '../student/student.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';
const userRouter = express.Router();
// create student
userRouter
  .route('/create-student')
  .post(
    auth(USER_ROLES.Admin),
    validateRequest(studentValidations.createStudentValidationSchema),
    userControllers.createStudent,
  );

// create faculty
userRouter
  .route('/create-faculty')
  .post(
    auth(USER_ROLES.Admin),
    validateRequest(facultyValidations.createFacultyValidationSchema),
    userControllers.createFaculty,
  );

// create admin
userRouter
  .route('/create-admin')
  .post(
    validateRequest(adminValidations.createAdminValidationSchema),
    userControllers.createAdmin,
  );

// get me
userRouter
  .route('/me')
  .get(
    auth(USER_ROLES.Admin, USER_ROLES.Faculty, USER_ROLES.Student),
    userControllers.getMe,
  );

export const userRoutes = userRouter;
