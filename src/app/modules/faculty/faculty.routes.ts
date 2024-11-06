import express from 'express';
import { facultyControllers } from './faculty.controllers';
const facultyRouter = express.Router();
facultyRouter.route('/').get(facultyControllers.getAllFaculties);
facultyRouter.route('/:id').get(facultyControllers.getSingleFaculty);

export const facultyRoutes = facultyRouter;
