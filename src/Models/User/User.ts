import { Prisma, User } from '@prisma/client';

const userFields: Prisma.UserSelect = {
  id: true,
  username: true,
  firstname: true,
  lastname: true,
  email: true,
  password_hash: true,
  profile_url: true,
  phone: true,
  workspaces: true,
  workspaceMember: true,
  taskAssignees: true,
  comments: true,
  settings: true,
  projectMember: true,
};

export {
  User,
  userFields,
};
