import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { authValidation } from './auth.validations';
import { authControllers } from './auth.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
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
    auth(USER_ROLES.Admin, USER_ROLES.Faculty, USER_ROLES.Student),
    validateRequest(authValidation.changePasswordValidationSchema),
    authControllers.changePassword,
  );

export const AuthRoutes = router;
