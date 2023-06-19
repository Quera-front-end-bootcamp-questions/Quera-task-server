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
import {
  IWorkspaceMember,
  WorkspaceMember,
} from '../../Models/WorkspaceMember/WorkspaceMember';
import { IUser, User } from '../../Models/User/User';

export interface IUpdateWorkspaceRequestBody {
  name?: string;
  usernameOrId?: Types.ObjectId | string;
  image?: string;
}

export interface ICreateWorkspaceRequestBody {
  name: string;
  members?: string[];
  projects?: Types.ObjectId[];
  image?: String;
  color: String
}
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

export interface IAuthenticatedUpdateRequest extends IAuthenticatedRequest {
  body: IUpdateWorkspaceRequestBody;
}
export interface IAuthenticatedCreateRequest extends IAuthenticatedRequest {
  body: ICreateWorkspaceRequestBody;
}

export const createWorkspaceController = async (
  req: IAuthenticatedCreateRequest,
  res: Response
) => {
  const { name , color} = req.body;
  const userId: Types.ObjectId = new Types.ObjectId(req.user.id);

  try {
    const workspace = await createWorkspace(name, userId, color);
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



  try { 
     const workspaceId: Types.ObjectId = new Types.ObjectId(req.params.id);
  const userId: Types.ObjectId = new Types.ObjectId(req.user.id);
  
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
  const workspaceId: Types.ObjectId = new Types.ObjectId(req.params.id);
  const { name, usernameOrId, image }: IUpdateWorkspaceRequestBody = req.body;
  const userId: Types.ObjectId = new Types.ObjectId(req.user.id);

  try {
    if (!workspaceId) {
      return sendResponse(res, 500, null, 'id param is missing');
    }
    const updatedWorkspace = await updateWorkspace(
      workspaceId,
      { name, usernameOrId, image },
      userId
    );
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

export const deleteWorkspaceController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  const workspaceId = req.params.id;
  const userId = req.user.id;

  try {
    if (!workspaceId) {
      return sendResponse(res, 500, null, 'id param is missing');
    }

    const project = await deleteWorkspace(workspaceId, userId);

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

    const workspaceMember = await WorkspaceMember.findOne({
      workspace: new Types.ObjectId(workspaceId),
      user: user._id,
    });

    if (!workspaceMember) {
      return sendResponse(res, 404, null, 'Workspace member not found');
    }

    // Remove the member from the workspace members array
    workspace.members = workspace.members.filter(
      (memberId) => memberId.toString() !== workspaceMember._id.toString()
    );

    // Remove the WorkspaceMember references from the user's workspaceMember array
    user.workspaceMember = user.workspaceMember.filter(
      (workspaceMemberId) => !workspaceMember._id.equals(workspaceMemberId)
    );

    await user.save();
    // Save the updated workspace
    await workspace.save();

    // Remove the WorkspaceMember document
    await workspaceMember.deleteOne();

    return sendResponse(
      res,
      200,
      { workspaceId, username: user.username, userId: user._id },
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

    // Check if the user is already a member of the workspace
    const existingMember = await WorkspaceMember.findOne({
      workspace: new Types.ObjectId(workspaceId),
      user: user._id,
    });

    if (existingMember) {
      return sendResponse(
        res,
        400,
        null,
        'User is already a member of the workspace'
      );
    }

    // Create a new WorkspaceMember document
    const workspaceMember = new WorkspaceMember({
      workspace: new Types.ObjectId(workspaceId),
      user: user._id,
    });

    user.workspaceMember.push(workspaceMember._id);

    await user.save();
    // Save the WorkspaceMember document
    await workspaceMember.save();

    // Add the user to the workspace members array
    workspace.members.push(workspaceMember._id);

    // Save the updated workspace
    await workspace.save();

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
