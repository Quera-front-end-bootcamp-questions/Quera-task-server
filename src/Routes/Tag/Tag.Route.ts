import express from "express";
import {
  getTagsByTaskIdController,
  createTagController,
  updateTagController,
  deleteTagController,getTagByIdController, untagTaskController
} from "../../Controller/TagController/Tag.Controller";
import { verifyToken } from "../../Middleware/Authenticate";

const router = express.Router();

router.get("/task/:taskId", verifyToken, getTagsByTaskIdController);
router.post("/", verifyToken, createTagController);
router.post("/untag", verifyToken, untagTaskController);
router.patch("/:tagIdOrName", verifyToken, updateTagController);
router.delete("/:tagIdOrName", verifyToken, deleteTagController);
router.get("/:tagIdOrName", verifyToken, getTagByIdController);
export default router;
