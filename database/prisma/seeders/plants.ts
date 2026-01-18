import { prisma, Plant } from '@database/prisma';

// We add `plantTypeName` only for seeding,
// then we translate it into the correct plantTypeID.
type PlantSeed = Omit<Plant, 'id' | 'plantTypeID'> & {
  plantTypeName: string;
};

const plants: PlantSeed[] = [
  {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    description: 'Fast-growing annual that produces edible red fruits.',
    image: 'https://bonnieplants.com/cdn/shop/articles/BONNIE_tomatoes_iStock-481349128-1800px_43c63bb9-9102-4e7f-823b-94a0b295ff0f.jpg?v=1766498650',
    plantTypeName: 'Bush', // change when you want
    createdAt: new Date()
  },
  {
    name: 'Strawberry',
    scientificName: 'Fragaria × ananassa',
    description: 'Perennial groundcover that produces sweet berries.',
    image: 'https://cdn.mos.cms.futurecdn.net/8JSxroK8emP69sD5Xp24Pk-1252-80.jpg',
    plantTypeName: 'Bush', // change when you want
    createdAt: new Date()
  },
  {
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    description: 'Drought-tolerant herb that attracts pollinators.',
    image: 'https://www.gardendesign.com/pictures/images/675x529Max/site_3/english-lavender-lavandula-angustifolia-garden-design_11716.jpg',
    plantTypeName: 'Flower',
    createdAt: new Date()
  }
];

export const seedPlants = async (): Promise<void> => {
  try {
    const types = await prisma.plantType.findMany({ select: { id: true, name: true } });

    if (types.length === 0) {
      throw new Error('No PlantTypes found. Run seedPlantTypes() before seedPlants().');
    }

    const typeByName = new Map(types.map((t) => [t.name, t.id]));
    const unknownTypeId = typeByName.get('Unknown');

    const plantData: Omit<Plant, 'id'>[] = plants.map((p) => {
      const typeId = typeByName.get(p.plantTypeName) ?? unknownTypeId;

      if (!typeId) {
        throw new Error(
          `PlantType "${p.plantTypeName}" not found and no "Unknown" PlantType exists.`
        );
      }

      return {
        name: p.name,
        scientificName: p.scientificName,
        description: p.description,
        image: p.image,
        plantTypeID: typeId,
        createdAt: p.createdAt
      };
    });

    await prisma.plant.createMany({
      data: plantData,
      // Turn this on if you want re-running seeds to not error.
      // Note: skipDuplicates only works if you have a unique constraint that would be violated.
      // skipDuplicates: true,
    });

    console.log('✅ Plants seeded');
  } catch (e) {
    console.error('❌ Error seeding plants:', e);
    throw e;
  }
};
