import "dotenv/config";
import { seedEvents } from './events.js';
import { seedPlants } from './plants.js';
import { seedRewards } from './rewards.js';
import { seedUsers } from './users.js';
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
