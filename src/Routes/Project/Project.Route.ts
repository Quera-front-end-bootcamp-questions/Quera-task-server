import express from "express";
import {
  createProjectController,
  getProjectByIdController,
  getProjectsByWorkspaceIdController,
  updateProjectController,
  deleteProjectController,
} from "../../Controller/ProjectController/Project.Controller";

const router = express.Router();

// Create new project
router.post("/createproject", createProjectController);

// Get project by ID
router.get("getprojectbyid/:id", getProjectByIdController);

// Get projects by workspace ID
router.get("/workspace/:id", getProjectsByWorkspaceIdController);

// Update project by ID
router.put("updateproject/:id", updateProjectController);

// Delete project by ID
router.delete("deleteprojectcontroller/:id", deleteProjectController);

export default router;
