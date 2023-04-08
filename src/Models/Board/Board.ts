// models/board.ts

import { Prisma, Board } from '@prisma/client';
import { Project, projectFields } from '../Project/Project';
import { Task, taskFields } from '../Task/Task';

const boardFields: Prisma.BoardSelect = {
  id: true,
  name: true,
  position: true,
  project: {
    select: projectFields,
  },
  tasks: {
    select: taskFields,
  },
};

export {
  Board,
  boardFields,
};
