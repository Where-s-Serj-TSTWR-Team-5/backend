import { PrismaClient } from '@prisma/client';
import { Plant } from './types.js';

const prisma: PrismaClient = new PrismaClient();

// Example plant seed data – adjust/add more as you like
const plants: Plant[] = [
  {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    description: 'Fast-growing annual that produces edible red fruits.',
    sunlightRequirement: 2, // e.g. 0 = shade, 1 = partial, 2 = full
    waterNeeds: 2,          // e.g. 0 = low, 2 = high
    image: '/images/plants/tomato.jpg',
    plantTypeID: 1,
  },
  {
    name: 'Strawberry',
    scientificName: 'Fragaria × ananassa',
    description: 'Perennial groundcover that produces sweet berries.',
    sunlightRequirement: 2,
    waterNeeds: 2,
    image: '/images/plants/strawberry.jpg',
    plantTypeID: 1,
  },
  {
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    description: 'Drought-tolerant herb that attracts pollinators.',
    sunlightRequirement: 2,
    waterNeeds: 1,
    image: '/images/plants/lavender.jpg',
    plantTypeID: 2,
  },
];

const load = async (): Promise<void> => {
  try {
    await prisma.plant.createMany({
      data: plants,
    });
    console.log('✅ Added plant data');
  } catch (e) {
    console.error('❌ Error seeding plants:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
