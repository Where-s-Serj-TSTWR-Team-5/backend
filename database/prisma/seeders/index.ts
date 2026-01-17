import "dotenv/config";
import { seedEventLabels } from "./event_labels.js";
import { seedEvents } from './events.js';
import { seedPlants } from './plants.js';
import { seedRewards } from './rewards.js';
import { seedUsers } from './users.js';
import { prisma } from '@database/prisma';

const main = async () => {
  try {
    await seedUsers();
    await seedEventLabels();
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
