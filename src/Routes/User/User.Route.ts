import express from "express";
import { registerUserController } from "../../Controller/UserController/User.Controller";

const router = express.Router();

// Register a new user
router.post("/register", registerUserController);

export default router;
