import express from "express";
import {
  getUserByIdController,
  updateUserController,
} from "../../Controller/UserController/User.Controller";

const router = express.Router();

router.get("/users/:id", getUserByIdController);
router.put("/users/:id", updateUserController);

export default router;
