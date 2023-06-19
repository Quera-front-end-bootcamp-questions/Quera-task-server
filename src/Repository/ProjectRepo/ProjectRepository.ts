import { Workspace } from '../../Models/Workspace/Workspace';
import ProjectMember from '../../Models/ProjectMember/ProjectMember';
import { Project } from '../../Models/Project/Project';
import { User } from '../../Models/User/User';
import { Types } from 'mongoose';

const createProject = async (
  name: string,
  workspaceId: string,
  userId: Types.ObjectId,
  color: string
): Promise<any> => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  const project = await Project.create({
    name,
    workspace: workspaceId,
    color
  });

  const owner = await User.findById(userId);

  if (owner) {
    const projectMember = await ProjectMember.create({
      user: userId,
      project: project._id,
      role: 'owner',
    });
    workspace.projects.push(project._id);
    workspace.save();

    owner?.projectMember.push(projectMember._id);
    owner?.save();

    project.members.push(projectMember._id);
    project.save();

    const resData: any = await project.toObject();
    resData.members = await Promise.all(
      resData.members.map(async (projectMemberId: Types.ObjectId) => {
        const projectMemberData = await ProjectMember.findOne({
          _id: projectMemberId,
        });
        const userData = await User.findById(projectMemberData.user);
        return {
          _id: userData?._id,
          username: userData?.username,
          email: userData?.email,
          role: projectMemberData.role,
        };
      })
    );
    delete resData.__v;
    delete resData.boards;
    console.log(resData);

    return resData;
  }
  throw Error('owner not found');
};

const getProjectById = async (id: string): Promise<any> => {
  const project = await Project.findById(id)
    .select('-__v')
    .populate({
      path: 'members',
      select: '-__v -project -_id',
      populate: {
        path: 'user',
        select:
          '-password_hash -__v -password_reset_token -settings -phone -workspaces -workspaceMember -taskAssignees -projectMember -comments',
      },
    });
  return project;
};

const getProjectsByWorkspaceId = async (workspaceId: string): Promise<any> => {
  const projects = await Project.find({ workspace: workspaceId })
    .select('-__v')
    .populate({
      path: 'members',
      select: '-__v -project -_id',
      populate: {
        path: 'user',
        select:
          '-password_hash -__v -password_reset_token -settings -phone -workspaces -workspaceMember -taskAssignees -projectMember -comments',
      },
    })
    .populate('boards');
  console.log(projects, workspaceId);
  // TODO populate board
  return projects;
};

const deleteProject = async (id: string): Promise<any> => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    throw new Error('Project not found');
  }
  return project;
};
const updateProject = async (id: string, updates: any): Promise<any> => {
  let project = await Project.findByIdAndUpdate(id, updates, { new: true });
  if (!project) {
    throw new Error('Project not found');
  }

  project = project.toObject();
  delete project.__v;

  return project;
};

export {
  createProject,
  getProjectById,
  getProjectsByWorkspaceId,
  deleteProject,
  updateProject,
};
