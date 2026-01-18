import { prisma } from '@database/prisma';

export const seedPlantedPlants  = async (): Promise<void> => {
  try {
    const users = await prisma.user.findMany({ select: { id: true } });
    const plants = await prisma.plant.findMany({ select: { id: true } });

    if (users.length === 0) {
      console.log('⚠️ No users found — skipping PlantedPlants seeding');
      return;
    }

    if (plants.length === 0) {
      console.log('⚠️ No plants found — skipping PlantedPlants seeding');
      return;
    }

    const plantedPlantsData = users.map((u, index) => {
      const plant = plants[index % plants.length];

      return {
        ownerId: u.id,
        plantId: plant.id,
        mapX: Math.random() * 100,
        mapY: Math.random() * 100,
        plantedAt: new Date(),
        harvestedAt: null,
        sunlightLevel: Math.floor(Math.random() * 3),
        waterLevel: Math.floor(Math.random() * 3)
      };
    });

    await prisma.plantedPlant.createMany({
      data: plantedPlantsData,
      // If you have @@unique([ownerId, plantId]) this prevents rerun duplicates:
      // skipDuplicates: true
    });

    console.log('✅ PlantedPlants seeded');
  } catch (e) {
    console.error('❌ Error seeding PlantedPlants:', e);
    throw e;
  }
};
