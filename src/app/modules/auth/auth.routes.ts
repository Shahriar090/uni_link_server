import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { authValidation } from './auth.validations';
import { authControllers } from './auth.controllers';
const router = express.Router();

router
  .route('/login')
  .post(
    validateRequest(authValidation.loginValidationSchema),
    authControllers.loginUser,
  );

// change password route
router
  .route('/change-password')
  .post(
    validateRequest(authValidation.changePasswordValidationSchema),
    authControllers.changePassword,
  );

export const AuthRoutes = router;
