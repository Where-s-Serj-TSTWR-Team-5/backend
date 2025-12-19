import { PrismaClient, Reward } from '@prisma/client';

const prisma = new PrismaClient();

const rewards: Omit<Reward, 'id'>[] = [
  {
    title: 'Lemon tree seeds',
    description: 'Grow your own lemon tree with these high-quality seeds.',
    thumbnail: 'https://example.com/images/lemon_tree_seeds.jpg',
    requiredPoints: 1000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Organic Fertilizer Pack',
    description: 'Boost your plant growth with our organic fertilizer pack.',
    thumbnail: 'https://example.com/images/organic_fertilizer_pack.jpg',
    requiredPoints: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Gardening Tool Set',
    description: 'A complete set of gardening tools for all your planting needs.',
    thumbnail: 'https://example.com/images/gardening_tool_set.jpg',
    requiredPoints: 1500,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const seedRewards = async (): Promise<void> => {
  try {
    await prisma.reward.createMany({
      data: rewards,
      // skipDuplicates: true, // avoids unique constraint errors
    });
    console.log('✅ Rewards seeded');
  } catch (e) {
    console.error('❌ Error seeding rewards:', e);
    throw e;
  }
};
