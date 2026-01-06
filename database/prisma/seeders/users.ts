import { prisma, User, ROLES } from '@database/prisma';

const users: Omit<User, 'id'>[] = [
  {
    userName: 'john_doe',
    email: 'johndoe@gmail.com',
    password: 'securepassword123',
    points: 100,
    role: ROLES.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userName: 'jane_smith',
    email: 'janesmith67@gmail.com',
    password: 'anothersecurepassword456',
    points: 150,
    role: ROLES.GREEN_OFFICE_MEMBER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userName: 'alice_wonder',
    email: 'aliceinwonderland@gmail.com',
    password: 'mypassword789',
    points: 200,
    role: ROLES.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Export a seed function
export const seedUsers = async (): Promise<void> => {
  try {
    await prisma.user.createMany({
      data: users,
      // skipDuplicates: true, // avoids unique constraint errors
    });
    console.log('✅ Users seeded');
  } catch (e) {
    console.error('❌ Error seeding users:', e);
    throw e;
  }
};
