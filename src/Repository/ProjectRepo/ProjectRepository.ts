import Project from "../../Models/Project/Project";
import Workspace from "../../Models/Workspace/Workspace";
import ProjectMember from "../../Models/ProjectMember/ProjectMember";

const createProject = async (
  name: string,
  workspaceId: string,
  members: string[]
): Promise<any> => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const project = await Project.create({
    name,
    workspace: workspaceId,
  });

  if (members && members.length > 0) {
    const projectMembers = members.map((member) => ({
      user: member,
      project: project._id,
    }));
    await ProjectMember.insertMany(projectMembers);
  }

  return project;
};

const getProjectById = async (id: string): Promise<any> => {
  const project = await Project.findById(id);
  return project;
};

const getProjectsByWorkspaceId = async (workspaceId: string): Promise<any> => {
  const projects = await Project.find({ workspace: workspaceId })
    .populate("members")
    .populate("boards");
  return projects;
};

const deleteProject = async (id: string): Promise<any> => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};
const updateProject = async (id: string, updates: any): Promise<any> => {
  const project = await Project.findByIdAndUpdate(id, updates, { new: true });
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};

export {
  createProject,
  getProjectById,
  getProjectsByWorkspaceId,
  deleteProject,
  updateProject,
};
