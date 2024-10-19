import express from 'express';
import { userControllers } from './user.controllers';
const userRouter = express.Router();

userRouter.route('/create-student').post(userControllers.createStudent);

export const userRoutes = userRouter;
