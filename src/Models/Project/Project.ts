// models/project.ts

import { Prisma, Project } from '@prisma/client';
import { Workspace, workspaceFields } from '../Workspace/Workspace';
import { ProjectMember, projectMemberFields } from '../ProjectMember/ProjectMember';
import { Board, boardFields } from '../Board/Board';

const projectFields: Prisma.ProjectSelect = {
  id: true,
  name: true,
  workspace: {
    select: workspaceFields,
  },
  members: {
    select: projectMemberFields,
  },
  boards: {
    select: boardFields,
  },
};

export {
  Project,
  projectFields,
};
