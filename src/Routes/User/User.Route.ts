import express from "express";
import {
  getUserByIdController,
  getUserByUsernameController,
  updateUserController,
} from "../../Controller/UserController/User.Controller";
import { verifyToken } from "../../Middleware/Authenticate";

const router = express.Router();
router.get("/:usernameOrId", getUserByUsernameController);
router.put("/:id", verifyToken , updateUserController);

export default router;
