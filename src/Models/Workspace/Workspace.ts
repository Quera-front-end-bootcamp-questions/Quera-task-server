// models/workspace.ts

import { Prisma, Workspace } from '@prisma/client';
import { User, userFields } from '../User/User';
import { WorkspaceMember, workspaceMemberFields } from '../WorkspaceMember/WorkspaceMember';
import { Project, projectFields } from '../Project/Project';

const workspaceFields: Prisma.WorkspaceSelect = {
  id: true,
  name: true,
  createdAt: true,
  image: true,
  user: {
    select: userFields,
  },
  members: {
    select: workspaceMemberFields,
  },
  projects: {
    select: projectFields,
  },
};

export {
  Workspace,
  workspaceFields,
};
