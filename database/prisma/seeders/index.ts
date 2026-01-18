import "dotenv/config";
import { seedUsers } from './users.js';
import { seedPlantTypes } from './plantTypes.js'; // before plants
import { seedPlantOwnerHistory } from './plantOwnerHistory.js';
import { seedPlants } from './plants.js';
import { seedPlantedPlants } from './plantedPlants.js'; // after users & plants
import { seedEvents } from './events.js'; // after users
import { seedRewards } from './rewards.js';
import { prisma } from '@database/prisma';
import { seedEventLabels } from "./event_labels.js";

const main = async () => {
  try {
    await seedUsers();
    await seedPlantTypes();
    await seedPlants();
    await seedPlantOwnerHistory();
    await seedPlantedPlants();
    await seedEventLabels();
    await seedEvents();
    await seedRewards();

    console.log('✅ All seeders finished');
  } catch (e) {
    console.error('❌ Seeding failed:', e);
  } finally {
    await prisma.$disconnect();
  }
};

main();
