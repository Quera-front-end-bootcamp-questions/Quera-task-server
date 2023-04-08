// models/workspaceMember.ts

import { Prisma, WorkspaceMember } from '@prisma/client';
import { User, userFields } from '../User/User';
import { Workspace, workspaceFields } from '../Workspace/Workspace';

const workspaceMemberFields: Prisma.WorkspaceMemberSelect = {
  userId: true,
  workspaceId: true,
  user: {
    select: userFields,
  },
  Workspace: {
    select: workspaceFields,
  },
};

export {
  WorkspaceMember,
  workspaceMemberFields,
};
