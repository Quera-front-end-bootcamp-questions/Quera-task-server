import { Request, Response } from 'express';

import {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspacesForUser,
  getWorkspaceById,
  updateWorkspace,
} from '../../Repository/workspaceRepo/workspaceRepository';
import { sendResponse } from '../../Utils/SendResponse';
import { Types } from 'mongoose';
import { IWorkspace, Workspace } from '../../Models/Workspace/Workspace';
import { WorkspaceMember } from '../../Models/WorkspaceMember/WorkspaceMember';
import { IUser, User } from '../../Models/User/User';

export interface ICreateWorkspaceRequestBody {
  name: string;
  members?: string[];
  projects?: Types.ObjectId[];
  image?: String;
}
export interface IAuthenticatedRequest extends Request<any, any, any, any> {
  user: {
    id: string;
    username: string;
    email: string;
  };
  params: {
    id?: Types.ObjectId;
  };
}

export interface IAuthenticatedCreateRequest extends IAuthenticatedRequest {
  body: ICreateWorkspaceRequestBody;
}
export interface IAuthenticatedUpdateRequest extends IAuthenticatedRequest {
  body: Partial<ICreateWorkspaceRequestBody>;
}

export const createWorkspaceController = async (
  req: IAuthenticatedCreateRequest,
  res: Response
) => {
  const { name, members } = req.body;
  console.log(req.user);
  const userId: Types.ObjectId = new Types.ObjectId(req.user.id);

  try {
    const workspace = await createWorkspace(name, userId, members);
    return sendResponse(res, 201, workspace, 'workspace created successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const getAllUserWorkspacesController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  const userId: Types.ObjectId = new Types.ObjectId(req.user.id);

  try {
    const workspaces = await getAllWorkspacesForUser(userId);
    console.log(workspaces);

    return sendResponse(
      res,
      200,
      workspaces,
      'Workspaces fetched successfully'
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const getWorkspaceByIdController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  const workspaceId: Types.ObjectId = new Types.ObjectId(req.params.id);
  const userId: Types.ObjectId = new Types.ObjectId(req.user.id);

  try {
    const workspace: IWorkspace | null = await getWorkspaceById(workspaceId);

    if (!workspace) {
      return sendResponse(res, 404, null, 'Workspace not found');
    }

    if (workspace.user._id.toString() !== userId.toString()) {
      return sendResponse(res, 401, null, 'Not authorized');
    }

    return sendResponse(res, 200, workspace, 'Workspace found');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const updateWorkspaceController = async (
  req: IAuthenticatedUpdateRequest,
  res: Response
) => {
  const workspaceId = req.params.id;
  const updates = req.body;

  try {
    if (!workspaceId) {
      return sendResponse(res, 500, null, 'id param is missing');
    }
    const updatedWorkspace = await updateWorkspace(workspaceId, updates);
    return sendResponse(
      res,
      200,
      updatedWorkspace,
      'workspace updated successfully'
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};
// export const getProjectsByWorkspaceIdController = async (
//   req: Request<any, any, any, { workspaceId: string }>,
//   res: Response
// ) => {
//   const workspaceId: any = req.params.workspaceId;

//   try {
//     const projects = await getWorkspacesByProjectId(workspaceId);
//     return sendResponse(res, 200, projects, 'Projects retrieved successfully');
//   } catch (error) {
//     console.error(error);
//     return sendResponse(res, 500, null, 'Server error');
//   }
// };

export const deleteWorkspaceController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  const workspaceId = req.params.id;

  try {
    if (!workspaceId) {
      return sendResponse(res, 500, null, 'id param is missing');
    }

    const project = await deleteWorkspace(workspaceId);

    return sendResponse(res, 200, project, 'workspace deleted successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const removeWorkspaceMemberController = async (
  req: Request,
  res: Response
) => {
  const { workspaceId, usernameOrId } = req.params;

  try {
    const workspace: IWorkspace | null = await Workspace.findById(workspaceId);

    if (!workspace) {
      return sendResponse(res, 404, null, 'Workspace not found');
    }

    // Find the user by username or member ID
    let user: IUser | null;
    if (usernameOrId) {
      // Check if the provided value is a valid ObjectID
      const isObjectId = Types.ObjectId.isValid(usernameOrId);
      if (isObjectId) {
        user = await User.findById(usernameOrId);
      } else {
        user = await User.findOne({ username: usernameOrId });
      }
    } else {
      return sendResponse(res, 400, null, 'Username or member ID is required');
    }

    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }

    // Check if the user is a member of the workspace
    const memberIndex = workspace.members.indexOf(user._id);
    if (memberIndex === -1) {
      return sendResponse(
        res,
        400,
        null,
        'User is not a member of the workspace'
      );
    }

    // Remove the user from the workspace members array
    workspace.members.splice(memberIndex, 1);

    // Save the updated workspace
    await workspace.save();

    // Delete the WorkspaceMember document
    await WorkspaceMember.findOneAndDelete({
      workspaceId: new Types.ObjectId(workspaceId),
      userId: user._id,
    });

    return sendResponse(
      res,
       200,
      { workspaceId, userId: user._id },
      'Member removed from workspace successfully'
    );
  } catch (error) {
    console.error('Error removing workspace member:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const addWorkspaceMemberController = async (
  req: Request,
  res: Response
) => {
  const { workspaceId, usernameOrId  } = req.params;

  try {
    const workspace: IWorkspace | null = await Workspace.findById(workspaceId);

    if (!workspace) {
      return sendResponse(res, 404, null, 'Workspace not found');
    }

    // Find the user by username or member ID
    let user: IUser | null;
    if (usernameOrId) {
      // Check if the provided value is a valid ObjectID
      const isObjectId = Types.ObjectId.isValid(usernameOrId);
      if (isObjectId) {
        user = await User.findById(usernameOrId);
      } else {
        user = await User.findOne({ username: usernameOrId });
      }
    } else {
      return sendResponse(res, 400, null, 'Username or member ID is required');
    }

    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }

    // Check if the user is already a member of the workspace
    const existingMember = await WorkspaceMember.findOne({
      workspaceId: new Types.ObjectId(workspaceId),
      userId: user._id,
    });

    if (existingMember) {
      return sendResponse(
        res,
        400,
        null,
        'User is already a member of the workspace'
      );
    }

    // Add the user to the workspace members array
    workspace.members.push(user._id);

    // Save the updated workspace
    await workspace.save();

    // Create a new WorkspaceMember document
    const workspaceMember = new WorkspaceMember({
      workspaceId: new Types.ObjectId(workspaceId),
      userId: user._id,
    });

    // Save the WorkspaceMember document
    await workspaceMember.save();

    return sendResponse(
      res,
      200,
      { workspaceId, userId: user._id },
      'Member added to workspace successfully'
    );
  } catch (error) {
    console.error('Error adding workspace member:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};
