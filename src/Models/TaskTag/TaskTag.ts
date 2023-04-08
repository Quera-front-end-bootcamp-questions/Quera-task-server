// models/taskTag.ts

import { Prisma, TaskTag } from '@prisma/client';
import { Task, taskFields } from '../Task/Task';
import { Tag, tagFields } from '../Tag/Tag';

const taskTagFields: Prisma.TaskTagSelect = {
  taskId: true,
  tagId: true,
  Task: {
    select: taskFields,
  },
  Tag: {
    select: tagFields,
  },
};

export {
  TaskTag,
  taskTagFields,
};
