import { seedEvents } from './events.ts';
import { seedPlants } from './plants.ts';
import { seedRewards } from './rewards.ts';
import { seedUsers } from './users.ts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  try {
    await seedUsers();
    await seedEvents();
    await seedPlants();
    await seedRewards();
    console.log('✅ All seeders finished');
  } catch (e) {
    console.error('❌ Seeding failed:', e);
  } finally {
    await prisma.$disconnect();
  }
};

main();
