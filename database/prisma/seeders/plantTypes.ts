import { prisma } from '@database/prisma';

const plantTypes = [
  { name: 'Bush' },
  { name: 'Flower' },
  { name: 'Tree' },
  { name: 'Bonsai' },
  { name: 'Unknown' }
];

export const seedPlantTypes = async (): Promise<void> => {
  try {
    await prisma.plantType.createMany({
      data: plantTypes,
      // skipDuplicates: true
    });

    console.log('✅ PlantTypes seeded');
  } catch (e) {
    console.error('❌ Error seeding PlantTypes:', e);
    throw e;
  }
};
