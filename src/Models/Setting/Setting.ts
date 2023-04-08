// models/setting.ts

import { Prisma, Setting } from '@prisma/client';
import { User, userFields } from '../User/User';

const settingFields: Prisma.SettingSelect = {
  id: true,
  theme: true,
  user: {
    select: userFields,
  },
};

export {
  Setting,
  settingFields,
};
