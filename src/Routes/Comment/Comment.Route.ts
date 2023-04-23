import express from "express";
import {
  createCommentController,
  getCommentByIdController,
  getCommentsByTaskIdController,
  updateCommentController,
  deleteCommentController
} from "../../Controller/CommentController/Comment.Controller";

const router = express.Router();

router.get("/tasks/:taskId/comments", getCommentsByTaskIdController);
router.post("/comments", createCommentController);
router.get("/comments/:id", getCommentByIdController);
router.patch("/comments/:id", updateCommentController);
router.delete("/comments/:id", deleteCommentController);

export default router;