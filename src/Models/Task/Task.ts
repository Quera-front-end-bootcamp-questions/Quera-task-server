// models/task.ts

import { Prisma, Task } from '@prisma/client';
import { Board, boardFields } from '../Board/Board';
import { TaskTag, taskTagFields } from '../TaskTag/TaskTag';
import { TaskAssignee, taskAssigneeFields } from '../TaskAssignee/TaskAssignee';
import { Comment, commentFields } from '../Comment/Comment';

const taskFields: Prisma.TaskSelect = {
  id: true,
  name: true,
  deadline: true,
  label: true,
  board: {
    select: boardFields,
  },
  taskTags: {
    select: taskTagFields,
  },
  taskAssigns: {
    select: taskAssigneeFields,
  },
  comments: {
    select: commentFields,
  },
};

export {
  Task,
  taskFields,
};
