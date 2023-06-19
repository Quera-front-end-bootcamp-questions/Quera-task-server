import { Request, Response } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectsByWorkspaceId,
  updateProject,
} from "../../Repository/ProjectRepo/ProjectRepository";
import { sendResponse } from "../../Utils/SendResponse";
import { Types } from "mongoose";
import ProjectMember from "../../Models/ProjectMember/ProjectMember";
import { IUser, User } from "../../Models/User/User";
import { IProject, Project } from "../../Models/Project/Project";


export interface IAuthenticatedRequest extends Request<any, any, any, any> {
  user: {
    id: Types.ObjectId;
    username: string;
    email: string;
  };
  params: {
    id?: Types.ObjectId;
  };
}

export const createProjectController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  const { name, workspaceId , color} = req.body;
  const userId = req?.user.id

  try {
    const project = await createProject(name, workspaceId, userId, color);
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
  req: Request<any, any, any, { id: string }>,
  res: Response
) => {
  const workspaceId: any = req.params.id;

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
  req: Request<any, any, { id: string, color:string }, any, { name?: string, position: number }>,
  res: Response
) => {
  const projectId: string = req.params.id;
  const updates = req.body;
  console.log(updates);
  

  try {
    const project = await updateProject(projectId, updates);

    return sendResponse(res, 200, project, "Project updated successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};


export const addProjectMemberController = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId, usernameOrId } = req.params;

    if (!projectId || !usernameOrId) {
      return sendResponse(res, 400, null, 'Both projectId and usernameOrId are required');
    }

    // Check if project id is valid
    if (!Types.ObjectId.isValid(projectId)) {
      return sendResponse(res, 400, null, 'Invalid project ID');
    }

    const project: IProject | null = await Project.findById(projectId);

    if (!project) {
      return sendResponse(res, 404, null, 'Project not found');
    }

    // Find the user by username or member ID
    let user: IUser | null;

    if (Types.ObjectId.isValid(usernameOrId)) {
      user = await User.findById(usernameOrId);
    } else {
      user = await User.findOne({ username: usernameOrId });
    }

    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }

    // Check if the user is already a member of the project
    const existingMember = await ProjectMember.findOne({
      project: new Types.ObjectId(projectId),
      user: user._id
    });
    console.log(existingMember, user._id);
    

    if (existingMember) {
      return sendResponse(
        res,
        400,
        null,
        'User is already a member of the project'
      );
    }

    // Create a new ProjectMember document
    const projectMember = new ProjectMember({
      project: new Types.ObjectId(projectId),
      user: user._id,
      role: 'member'
    });
    projectMember.save()

    // Add the user to the project list and save
    project.members.push(projectMember._id);
    await project.save();

    // Add the project member to the user list and save
    user.projectMember.push(projectMember._id);
    await user.save();

    return sendResponse(
      res,
      200,
      {
        projectId: project._id,
        userId: user._id,
      },
      'User has been added to the project'
    );
  } catch (error) {
    console.error('Error adding project member:', error);
    return sendResponse(res, 500, null, 'Internal server error');
  }
};


export const removeProjectMemberController = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId, usernameOrId } = req.params;

    if (!projectId || !usernameOrId) {
      return sendResponse(res, 400, null, 'Both projectId and usernameOrId are required');
    }

    // Check if project id is valid
    if (!Types.ObjectId.isValid(projectId)) {
      return sendResponse(res, 400, null, 'Invalid project ID');
    }

    const project: IProject | null = await Project.findById(projectId);

    if (!project) {
      return sendResponse(res, 404, null, 'Project not found');
    }

    // Find the user by username or member ID
    let user: IUser | null;

    if (Types.ObjectId.isValid(usernameOrId)) {
      user = await User.findById(usernameOrId);
    } else {
      user = await User.findOne({ username: usernameOrId });
    }

    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }

    const projectMember = await ProjectMember.findOne({
      project: new Types.ObjectId(projectId),
      user: user._id,
    });

    if (!projectMember) {
      return sendResponse(res, 404, null, 'User is not a member of this project');
    }

    // Remove the ProjectMember references from the user's projectMember array
    user.projectMember = user.projectMember.filter(
      (projectMemberId) => !projectMember._id.equals(projectMemberId)
    );

    await user.save();

    // Remove the member from the project members array
    project.members = project.members.filter(
      (memberId) => memberId.toString() !== projectMember._id.toString()
    );

    // Save the updated project
    await project.save();

    // Remove the ProjectMember document
    await projectMember.deleteOne();

    return sendResponse(
      res,
      200,
      {
        projectId: project._id,
        username: user.username,
        userId: user._id,
      },
      'User has been removed from the project'
    );
  } catch (error) {
    console.error('Error removing project member:', error);
    return sendResponse(res, 500, null, 'Internal server error');
  }
};

