import express from 'express';
import { facultyControllers } from './faculty.controllers';
const facultyRouter = express.Router();
facultyRouter.route('/').get(facultyControllers.getAllFaculties);

export const facultyRoutes = facultyRouter;
