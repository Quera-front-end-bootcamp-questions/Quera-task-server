// database.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function dbConnect() {
  try {
    await prisma.$connect();
    console.log('Connected to database!');
  } catch (error) {
    console.error('Failed to connect to database', error);
  }
}

export { prisma, dbConnect };
