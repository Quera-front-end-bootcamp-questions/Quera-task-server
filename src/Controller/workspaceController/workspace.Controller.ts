import { Request, Response } from 'express';

import {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspacesForUser,
  getWorkspaceById,
  getWorkspacesByProjectId,
  updateWorkspace,
} from '../../Repository/workspaceRepo/workspaceRepository';
import { sendResponse } from '../../Utils/SendResponse';
import {Types } from 'mongoose';
import { IWorkspace } from '../../Models/Workspace/Workspace';

export interface ICreateWorkspaceRequestBody {
  name: string;
  members?: Types.ObjectId[];
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
