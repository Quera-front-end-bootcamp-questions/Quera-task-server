import express from "express";
import {
  registerUserController,
  loginUserController,
} from "../../Controller/UserController/User.Controller";

const router = express.Router();

// Register a new user
router.post("/register", registerUserController);
router.post("/login", loginUserController);

export default router;
