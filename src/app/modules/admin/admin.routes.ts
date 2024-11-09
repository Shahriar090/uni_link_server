import express from 'express';
import { adminControllers } from './admin.controllers';
import { validateRequest } from '../../middlewares/validateRequest';
import { adminValidations } from './admin.validation';
const adminRouter = express.Router();

// get all admins
adminRouter.route('/').get(adminControllers.getAllAdmins);
export const adminRoutes = adminRouter;

// get single admin
adminRouter.route('/:id').get(adminControllers.getSingleAdmin);

// update admin
adminRouter
  .route('/:id')
  .patch(
    validateRequest(adminValidations.updateAdminValidationSchema),
    adminControllers.updateAdmin,
  );

// delete admin
adminRouter.route('/:id').delete(adminControllers.deleteAdmin);
