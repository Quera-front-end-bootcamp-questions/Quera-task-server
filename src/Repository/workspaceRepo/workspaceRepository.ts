import Project from '../../Models/Project/Project';
import { IWorkspace, Workspace } from '../../Models/Workspace/Workspace';
import { Schema, Types } from 'mongoose';
import {
  IWorkspaceMember,
  WorkspaceMember,
} from '../../Models/WorkspaceMember/WorkspaceMember';
import { ICreateWorkspaceRequestBody } from '../../Controller/workspaceController/workspace.Controller';

const createWorkspace = async (
  name: string,
  userId: Types.ObjectId,
  members?: Types.ObjectId[]
): Promise<IWorkspace> => {
  try {
    const workspace = new Workspace({
      name: name,
      user: new Types.ObjectId(userId),
    });

    const createdWorkspace = await workspace.save();
    if (members && members?.length > 0) {
      // Create WorkspaceMember documents for each member
      const workspaceMembers: IWorkspaceMember[] = members.map((member) => {
        const workspaceMember = new WorkspaceMember({
          userId: member,
          workspaceId: createdWorkspace._id,
        });
        return workspaceMember;
      });

      // Save WorkspaceMember documents to the database
      const createdWorkspaceMembers = await WorkspaceMember.insertMany(
        workspaceMembers
      );

      // Update the createdWorkspace with the createdWorkspaceMembers
      createdWorkspace.members = createdWorkspaceMembers.map(
        (member) => member._id
      );
      await createdWorkspace.save();
    }
    return createdWorkspace;
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
      .populate('members', '-__v -user -workspace')
      .populate('projects', '-__v -workspace')
      .exec();

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
      .populate('members', '-__v -workspaceId -_id')
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
  updates: Partial<ICreateWorkspaceRequestBody>
): Promise<IWorkspace> => {
  const updatedWorkspace = await Workspace.findByIdAndUpdate(
    workspaceId,
    updates,
    {
      new: true,
      select: '-__v -createdAt -updatedAt'
    }
  );
  if (!updatedWorkspace) {
    throw new Error('workspace not found');
  }

  if (updates.members) {
    const workspaceMembers: IWorkspaceMember[] = updates.members.map(
      (member) => {
        const workspaceMember = new WorkspaceMember({
          userId: member,
          workspaceId: updatedWorkspace._id,
        });
        return workspaceMember;
      }
    );

    // Save WorkspaceMember documents to the database
    await WorkspaceMember.deleteMany({ workspaceId: updatedWorkspace._id });
    await WorkspaceMember.insertMany(workspaceMembers);
  }

  return updatedWorkspace;
};

const getWorkspacesByProjectId = async (workspaceId: string): Promise<any> => {
  const projects = await Project.find({ workspace: workspaceId })
    .populate('members')
    .populate('boards');
  return projects;
};

const deleteWorkspace = async (workspaceId: Types.ObjectId): Promise<IWorkspace> => {
  const deletedWorkspace = await Workspace.findByIdAndDelete(workspaceId).select('-__v -createdAt -_id');
  if (!deletedWorkspace) {
    throw new Error('Workspace not found');
  }
  return deletedWorkspace;
};

export {
  createWorkspace,
  getWorkspaceById,
  deleteWorkspace,
  getAllWorkspacesForUser,
  getWorkspacesByProjectId,
  updateWorkspace,
};
