import express from 'express';
import {
  registerUserController,
  loginUserController,
  resetPasswordController,
  forgotPasswordController,
  createRefreshTokenController,
} from '../../Controller/AuthenticationController/Auth.Controller';
import { sendResponse } from '../../Utils/SendResponse';

const router = express.Router();

// Register a new user
router.get('/test', (req, res) => {
  sendResponse(res, 200,{ test: 'test' }, 'success');
});
router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.post('/reset-password', resetPasswordController);
router.post('/forget-password', forgotPasswordController);
router.post('/refreshtoken', createRefreshTokenController);

export default router;
