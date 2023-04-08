// models/comment.ts

import { Prisma, Comment } from '@prisma/client';
import { User, userFields } from '../User/User';
import { Task, taskFields } from '../Task/Task';

const commentFields: Prisma.CommentSelect = {
  id: true,
  text: true,
  createdAt: true,
  user: {
    select: userFields,
  },
  task: {
    select: taskFields,
  },
};

export {
  Comment,
  commentFields,
};
