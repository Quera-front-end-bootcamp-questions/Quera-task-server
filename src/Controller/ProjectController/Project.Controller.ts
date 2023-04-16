import { Request, Response } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectsByWorkspaceId,
  updateProject,
} from "../../Repository/ProjectRepo/ProjectRepository";
import { sendResponse } from "../../Utils/SendResponse";

export const createProjectController = async (
  req: Request<
    any,
    any,
    { name: string; workspaceId: string; members: string[] },
    any
  >,
  res: Response
) => {
  const { name, workspaceId, members } = req.body;

  try {
    const project = await createProject(name, workspaceId, members);
    return sendResponse(res, 201, project, "Project created successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};

export const getProjectByIdController = async (
  req: Request<any, any, any, { id: string }>,
  res: Response
) => {
  const projectId: any = req.params.id;

  try {
    const project = await getProjectById(projectId);

    if (!project) {
      return sendResponse(res, 404, null, "Project not found");
    }

    return sendResponse(res, 200, project, "Project retrieved successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};

export const getProjectsByWorkspaceIdController = async (
  req: Request<any, any, any, { workspaceId: string }>,
  res: Response
) => {
  const workspaceId: any = req.params.workspaceId;

  try {
    const projects = await getProjectsByWorkspaceId(workspaceId);
    return sendResponse(res, 200, projects, "Projects retrieved successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};

export const deleteProjectController = async (
  req: Request<any, any, { id: string }>,
  res: Response
) => {
  const projectId: string = req.params.id;

  try {
    const project = await deleteProject(projectId);

    return sendResponse(res, 200, project, "Project deleted successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};

export const updateProjectController = async (
  req: Request<any, any, { id: string }, any, { name?: string }>,
  res: Response
) => {
  const projectId: string = req.params.id;
  const updates = req.body;

  try {
    const project = await updateProject(projectId, updates);

    return sendResponse(res, 200, project, "Project updated successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};
