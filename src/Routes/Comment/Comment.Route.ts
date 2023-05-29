import express from "express";
import {
  createCommentController,
  getCommentByIdController,
  getCommentsByTaskIdController,
  updateCommentController,
  deleteCommentController
} from "../../Controller/CommentController/Comment.Controller";
import { verifyToken } from "../../Middleware/Authenticate";

const router = express.Router();

router.get("/task/:taskId", verifyToken ,  getCommentsByTaskIdController);
router.post("/", verifyToken , createCommentController);
router.get("/:id", verifyToken , getCommentByIdController);
router.patch("/:id", verifyToken , updateCommentController);
router.delete("/:id", verifyToken , deleteCommentController);

export default router;