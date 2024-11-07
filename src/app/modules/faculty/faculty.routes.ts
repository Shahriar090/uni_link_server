import express from 'express';
import { facultyControllers } from './faculty.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';
const facultyRouter = express.Router();
// get
facultyRouter.route('/').get(facultyControllers.getAllFaculties);
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
