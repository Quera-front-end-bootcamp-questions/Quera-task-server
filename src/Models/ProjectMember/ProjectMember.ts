// models/projectMember.ts

import { Prisma, ProjectMember } from '@prisma/client';
import { User, userFields } from '../User/User';
import { Project, projectFields } from '../Project/Project';

const projectMemberFields: Prisma.ProjectMemberSelect = {
  projectId: true,
  userId: true,
  role: true,
  user: {
    select: userFields,
  },
  project: {
    select: projectFields,
  },
};

export {
  ProjectMember,
  projectMemberFields,
};
