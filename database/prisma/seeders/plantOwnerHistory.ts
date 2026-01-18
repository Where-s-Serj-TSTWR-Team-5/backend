import { prisma } from '@database/prisma';

export const seedPlantOwnerHistory = async (): Promise<void> => {
  try {
    const plant = await prisma.plant.findFirst();
    const users = await prisma.user.findMany({ take: 3 });

    if (!plant || users.length === 0) {
      console.warn('⚠️ Skipping PlantOwnerHistory seed (no plant or users found)');
      return;
    }

    await prisma.plantOwnerHistory.createMany({
      data: [
        {
          plantId: plant.id,
          ownerId: users[0].id,
          notes: 'Initial owner',
          isActive: false
        },
        {
          plantId: plant.id,
          ownerId: users[1]?.id ?? users[0].id,
          notes: 'Transferred due to graduation',
          isActive: false
        },
        {
          plantId: plant.id,
          ownerId: users[2]?.id ?? users[0].id,
          notes: 'Current caretaker',
          isActive: true
        }
      ]
    });

    console.log('✅ PlantOwnerHistory seeded (multiple rows)');
  } catch (e) {
    console.error('❌ Error seeding PlantOwnerHistory:', e);
    throw e;
  }
};
