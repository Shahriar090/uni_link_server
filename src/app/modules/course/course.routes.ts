import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { courseValidations } from './course.validation';
import { courseControllers } from './course.controllers';
const courseRouter = express.Router();

// create
courseRouter
  .route('/create-course')
  .post(
    validateRequest(courseValidations.createCourseValidationSchema),
    courseControllers.createCourse,
  );

//   get all
courseRouter.route('/').get(courseControllers.getAllCourses);

// get single
courseRouter.route('/:id').get(courseControllers.getSingleCourse);

// update a course
courseRouter
  .route('/:id')
  .patch(
    validateRequest(courseValidations.updateCourseValidationSchema),
    courseControllers.updateCourse,
  );

// delete one
courseRouter.route('/:id').delete(courseControllers.deleteCourse);

export const courseRoutes = courseRouter;
