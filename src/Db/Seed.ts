// users.ts

import { prisma } from './DbConnection';

async function createUser() {
  const user = await prisma.user.create({
    data: {
      username: 'johndoe',
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@example.com',
      password_hash: 'password123',
    },
  });

  console.log(user);
}
