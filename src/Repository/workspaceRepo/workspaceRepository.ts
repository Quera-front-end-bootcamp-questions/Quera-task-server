import { IWorkspace, Workspace } from '../../Models/Workspace/Workspace';
import {  Types } from 'mongoose';
import {
  IWorkspaceMember,
  WorkspaceMember,
} from '../../Models/WorkspaceMember/WorkspaceMember';
import {
  IUpdateWorkspaceRequestBody,
} from '../../Controller/workspaceController/workspace.Controller';
import { IUser, User } from '../../Models/User/User';

const createWorkspace = async (
  name: string,
  userId: Types.ObjectId,
  color: String
): Promise<Partial<IWorkspace>> => {
  try {
    const workspace = new Workspace({
      name: name,
      user: new Types.ObjectId(userId),
      color 
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { workspaces: workspace._id },
    });

    const createdWorkspace = (await workspace.save()).toObject();
    const { __v, createdAt, ...workspaceResData } = createdWorkspace;

    return workspaceResData;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
};

const getAllWorkspacesForUser = async (
  userId: Types.ObjectId
): Promise<IWorkspace[]> => {
  try {
    const workspaces = await Workspace.find(
      { user: userId },
      { __v: 0, createdAt: 0 }
    )
      .populate({
        path: 'members',
        select: '-__v -workspace -_id',
        populate: {
          path: 'user',
          select:
            '-password_hash -__v -password_reset_token -settings -phone -workspaces -workspaceMember -taskAssignees -projectMember -comments',
        },
      })
      .populate('projects', '-__v -workspace');

    return workspaces;
  } catch (error) {
    console.error(error);
    throw new Error('Error while getting user workspaces');
  }
};

const getWorkspaceById = async (
  workspaceId: Types.ObjectId
): Promise<IWorkspace | null> => {
  try {
    const workspace = await Workspace.findById(workspaceId, {
      createdAt: 0,
      __v: 0,
    })
      .populate(
        'user',
        '-password_hash -__v -password_reset_token -settings -phone -workspaces -workspaceMember -taskAssignees -projectMember -comments'
      )
      .populate({
        path: 'members',
        select: '-__v -workspace -_id',
        populate: {
          path: 'user',
          select:
            '-password_hash -__v -password_reset_token -settings -phone -workspaces -workspaceMember -taskAssignees -projectMember -comments',
        },
      })
      .populate('projects', '-__v -workspace')
      .exec();

    return workspace;
  } catch (error) {
    console.error(error);
    throw new Error('Error while getting workspace by id');
  }
};

const updateWorkspace = async (
  workspaceId: Types.ObjectId,
  updates: IUpdateWorkspaceRequestBody,
  userId: Types.ObjectId
): Promise<IWorkspace> => {
  try {
    const workspace: IWorkspace | null = await Workspace.findById(
      workspaceId
    ).select('-__v -createdAt');

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    if (!workspace.user.equals(userId)) {
      throw new Error('Not authorized to update this workspace');
    }

    if (updates.usernameOrId) {
      // Check if the new owner exists
      let newOwner: IUser | null;
      if (Types.ObjectId.isValid(updates.usernameOrId)) {
        newOwner = await User.findById(updates.usernameOrId);
      } else {
        newOwner = await User.findOne({ username: updates.usernameOrId });
      }

      if (!newOwner) {
        throw new Error('New owner not found');
      }

      // Update the owner of the workspace
      workspace.user = newOwner._id;

      // Remove the workspace from the previous owner's workspaces array
      const previousOwner: IUser | null = await User.findById(workspace.user);
      if (previousOwner) {
        previousOwner.workspaces = previousOwner.workspaces.filter(
          (workspace: Types.ObjectId) => !workspace.equals(workspaceId)
        );
        await previousOwner.save();
      }

      // Add the workspace to the new owner's workspaces array
      newOwner.workspaces.push(workspace._id);
      await newOwner.save();
    }

    // Update other fields of the workspace
    if (updates.name) {
      workspace.name = updates.name;
    }
    if (updates.image) {
      workspace.image = updates.image;
    }

    // Save the updated workspace
    await workspace.save();

    return workspace;
  } catch (error) {
    console.error('Error updating workspace:', error);
    throw error;
  }
};

// const getWorkspacesByProjectId = async (workspaceId: string): Promise<any> => {
//   const projects = await Project.find({ workspace: workspaceId })
//     .populate('members')
//     .populate('boards');
//   return projects;
// };

const deleteWorkspace = async (
  workspaceId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<IWorkspace> => {
  try {
    const workspace: IWorkspace | null = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    if (!workspace.user.equals(userId)) {
      console.log(!workspace.user, userId);

      throw new Error('Not authorized to delete this workspace');
    }

    // Remove the workspace from the user's workspaces array
    const user: IUser | null = await User.findById(workspace.user);
    if (user) {
      user.workspaces = user.workspaces.filter(
        (workspace: Types.ObjectId) => !workspace.equals(workspaceId)
      );

      // Find the associated WorkspaceMember documents
      const workspaceMembers: IWorkspaceMember[] = await WorkspaceMember.find({
        workspaceId,
      });

      // Remove the WorkspaceMember references from the user's workspaceMember array
      user.workspaceMember = user.workspaceMember.filter(
        (workspaceMemberId: Types.ObjectId) => {
          const found = workspaceMembers.find((workspaceMember) =>
            workspaceMember._id.equals(workspaceMemberId)
          );
          return !found;
        }
      );

      await user.save();
    }

    // Delete the workspace and its associated workspace members
    await Promise.all([
      Workspace.findByIdAndDelete(workspaceId),
      WorkspaceMember.deleteMany({ workspaceId }),
    ]);

    return workspace;
  } catch (error) {
    console.error('Error deleting workspace:', error);
    throw error;
  }
};

export {
  createWorkspace,
  getWorkspaceById,
  deleteWorkspace,
  getAllWorkspacesForUser,
  updateWorkspace,
};
