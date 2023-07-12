import express from 'express';
import {
  registerUserController,
  loginUserController,
  resetPasswordController,
  forgotPasswordController,
  createRefreshTokenController,
} from '../../Controller/AuthenticationController/Auth.Controller';

const router = express.Router();


/**
 * @openapi
 * 
 */

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.post('/reset-password', resetPasswordController);
router.post('/forget-password', forgotPasswordController);
router.post('/refreshtoken', createRefreshTokenController);

export default router;
