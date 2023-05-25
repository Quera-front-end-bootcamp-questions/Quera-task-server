import express from "express";
import {
  createProjectController,
  getProjectByIdController,
  getProjectsByWorkspaceIdController,
  updateProjectController,
  deleteProjectController,
  addProjectMemberController,
  removeProjectMemberController,
} from "../../Controller/ProjectController/Project.Controller";
import { verifyToken } from "../../Middleware/Authenticate";

const router = express.Router();

// Create a new project
router.post("/", verifyToken, createProjectController as any);

// Get a specific project by ID
router.get("/:id", verifyToken, getProjectByIdController);

// Get projects by workspace ID
router.get("/workspaces/:id", verifyToken, getProjectsByWorkspaceIdController);

// Update a specific project by ID
router.put("/:id", verifyToken, updateProjectController);

// Delete a specific project by ID
router.delete("/:id", verifyToken, deleteProjectController);

// Add a member to a specific project
router.put('/:projectId/members/:usernameOrId', verifyToken, addProjectMemberController);

// Remove a member from a specific project
router.delete('/:projectId/members/:usernameOrId', verifyToken, removeProjectMemberController);

export default router;
