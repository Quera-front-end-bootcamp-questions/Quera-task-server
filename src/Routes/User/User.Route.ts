import express from "express";
import { getUserByIdController } from "../../Controller/UserController/User.Controller";

const router = express.Router();

router.get("/users/:id", getUserByIdController);

export default router;
