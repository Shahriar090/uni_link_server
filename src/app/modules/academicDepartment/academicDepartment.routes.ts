import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { academicDepartmentValidations } from './academicDepartment.validation';
import { academicDepartmentControllers } from './academicDepartment.controllers';
const academicDepartmentRouter = express.Router();

// create
academicDepartmentRouter.route('/create-academic-department').post(
  // validateRequest(
  //   academicDepartmentValidations.createAcademicDepartmentValidationSchema,
  // ),
  academicDepartmentControllers.createAcademicDepartment,
);

// get all
academicDepartmentRouter
  .route('/')
  .get(academicDepartmentControllers.getAllAcademicDepartments);

//   get single
academicDepartmentRouter
  .route('/:departmentId')
  .get(academicDepartmentControllers.getSingleAcademicDepartment);

//   update
academicDepartmentRouter
  .route('/:departmentId')
  .patch(
    validateRequest(
      academicDepartmentValidations.updateAcademicDepartmentValidationSchema,
    ),
    academicDepartmentControllers.updateAcademicDepartment,
  );

export const academicDepartmentRoutes = academicDepartmentRouter;
