import { PrismaClient } from '@prisma/client';
// reference a type from the generated Prisma Client
// import type { Client } from '@prisma/client';
const prisma: PrismaClient = new PrismaClient();
import { Reward } from './types.js';

// if you use the model you have to fill in all the fields also the generated ones
const rewards: Reward[] = [
  {
    title: 'Lemon tree seeds',
    description: 'Grow your own lemon tree with these high-quality seeds.',
    thumbnail: 'https://example.com/images/lemon_tree_seeds.jpg',
    requiredPoints: 1000,
  },
  {
    title: 'Organic Fertilizer Pack',
    description: 'Boost your plant growth with our organic fertilizer pack.',
    thumbnail: 'https://example.com/images/organic_fertilizer_pack.jpg',
    requiredPoints: 500,
  },
  {
    title: 'Gardening Tool Set',
    description: 'A complete set of gardening tools for all your planting needs.',
    thumbnail: 'https://example.com/images/gardening_tool_set.jpg',
    requiredPoints: 1500,
  }
];

// first look if the exist in the database and then add them

const load = async (): Promise<void> => {
  try {
    await prisma.reward.createMany({
      data: rewards,
    });
    console.log('Added category data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
