import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { authValidation } from './auth.validations';
import { authControllers } from './auth.controllers';
const router = express.Router();

router;
router
  .route('/login')
  .post(
    validateRequest(authValidation.loginValidationSchema),
    authControllers.loginUser,
  );

export const AuthRoutes = router;
