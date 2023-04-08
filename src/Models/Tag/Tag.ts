// models/tag.ts

import { Prisma, Tag } from '@prisma/client';
import { TaskTag, taskTagFields } from '../TaskTag/TaskTag';

const tagFields: Prisma.TagSelect = {
  id: true,
  name: true,
  tasks: {
    select: taskTagFields,
  },
};

export {
  Tag,
  tagFields,
};
