// models/taskAssignee.ts

import { Prisma, TaskAssignee } from '@prisma/client';
import { Task, taskFields } from '../Task/Task';
import { User, userFields } from '../User/User';

const taskAssigneeFields: Prisma.TaskAssigneeSelect = {
  taskId: true,
  userId: true,
  Task: {
    select: taskFields,
  },
  User: {
    select: userFields,
  },
};

export {
  TaskAssignee,
  taskAssigneeFields,
};
