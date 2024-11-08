import express from 'express';
import { adminControllers } from './admin.controllers';
const adminRouter = express.Router();

// get all admins
adminRouter.route('/').get(adminControllers.getAllAdmins);
export const adminRoutes = adminRouter;

// get single admin
adminRouter.route('/:id').get(adminControllers.getSingleAdmin);
