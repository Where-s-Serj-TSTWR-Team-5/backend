import { PrismaClient } from '@prisma/client';
// reference a type from the generated Prisma Client
// import type { Client } from '@prisma/client';
const prisma: PrismaClient = new PrismaClient();
import { User } from './types.js';

// if you use the model you have to fill in all the fields also the generated ones
const users: User[] = [
  {
    userName: 'john_doe',
    email: 'johndoe@gmail.com',
    password: 'securepassword123',
    points: 100,
  },
  {
    userName: 'jane_smith',
    email: 'janesmith67@gmail.com',
    password: 'anothersecurepassword456',
    points: 150,
  },
  {
    userName: 'alice_wonder',
    email: 'aliceinwonderland@gmail.com',
    password: 'mypassword789',
    points: 200,
  }
];

// first look if the exist in the database and then add them

const load = async (): Promise<void> => {
  try {
    await prisma.user.createMany({
      data: users,
    });
    console.log('Added category data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
