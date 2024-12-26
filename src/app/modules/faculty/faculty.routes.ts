import express from 'express';
import { facultyControllers } from './faculty.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const facultyRouter = express.Router();
// get
facultyRouter
  .route('/')
  .get(
    auth(USER_ROLES.Admin, USER_ROLES.Faculty),
    facultyControllers.getAllFaculties,
  );
// get single
facultyRouter.route('/:id').get(facultyControllers.getSingleFaculty);
// update faculty
facultyRouter
  .route('/:id')
  .patch(
    validateRequest(facultyValidations.updateFacultyValidationSchema),
    facultyControllers.updateFaculty,
  );

//   delete faculty
facultyRouter.route('/:id').delete(facultyControllers.deleteFaculty);

export const facultyRoutes = facultyRouter;
