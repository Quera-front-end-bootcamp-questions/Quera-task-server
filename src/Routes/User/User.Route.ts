import express from "express";
import {
  getUserByIdController,
  getUserByUsernameController,
  updateUserController,
} from "../../Controller/UserController/User.Controller";

const router = express.Router();
router.get("/:usernameOrId", getUserByUsernameController);
router.put("/:id", updateUserController);

export default router;
