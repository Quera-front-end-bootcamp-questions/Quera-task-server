import express from "express";
import {
  getTagsByTaskIdController,
  createTagController,
  updateTagController,
  deleteTagController,getTagByIdController
} from "../../Controller/TagController/Tag.Controller";

const router = express.Router();

router.get("/tasks/:id/tags", getTagsByTaskIdController);
router.post("/tags", createTagController);
router.patch("/tags/:id", updateTagController);
router.delete("/tags/:id", deleteTagController);
router.get("/tag/:id", getTagByIdController);
export default router;
