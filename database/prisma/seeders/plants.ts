import { PrismaClient, Plant } from '@prisma/client';

const prisma = new PrismaClient();

const plants: Omit<Plant, 'id'>[] = [
  {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    description: 'Fast-growing annual that produces edible red fruits.',
    sunlightRequirement: 2,
    waterNeeds: 2,
    image: '/images/plants/tomato.jpg',
    plantTypeID: 1,
    createdAt: new Date(),
  },
  {
    name: 'Strawberry',
    scientificName: 'Fragaria × ananassa',
    description: 'Perennial groundcover that produces sweet berries.',
    sunlightRequirement: 2,
    waterNeeds: 2,
    image: '/images/plants/strawberry.jpg',
    plantTypeID: 1,
    createdAt: new Date(),
  },
  {
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    description: 'Drought-tolerant herb that attracts pollinators.',
    sunlightRequirement: 2,
    waterNeeds: 1,
    image: '/images/plants/lavender.jpg',
    plantTypeID: 2,
    createdAt: new Date(),
  }
];

export const seedPlants = async (): Promise<void> => {
  try {
    await prisma.plant.createMany({
      data: plants,
      // skipDuplicates: true, // avoids unique constraint errors
    });
    console.log('✅ Plants seeded');
  } catch (e) {
    console.error('❌ Error seeding plants:', e);
    throw e;
  }
};
