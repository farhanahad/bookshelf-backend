import express from 'express';
import validateRequest from '../../middlewares/validationRequest';
import { UserValidation } from '../user/user.validation';
import { UserController } from '../user/user.controller';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUserToDB
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUserToDB
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshTokenToDB
);

router.post('/logout', auth(), AuthController.logOut);

export const AuthRoutes = router;
