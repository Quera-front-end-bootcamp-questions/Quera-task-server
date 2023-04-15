import express from "express";
import {
  registerUserController,
  loginUserController,resetPasswordController,forgotPasswordController
} from "../../Controller/UserController/User.Controller";

const router = express.Router();

// Register a new user
router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/reset-password", resetPasswordController);
router.post("/forget-password", forgotPasswordController);


export default router;
