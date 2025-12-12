import { NextFunction, Request, Response } from 'express';
// import { PrismaClient } from '../../node_modules/.prisma/client.ts';
// import { PrismaClient } from '../../node_modules/.prisma/client/default.js';
import { PrismaClient } from '@prisma/client';
import { Reward } from '../../prisma/types.ts';
const prisma: PrismaClient = new PrismaClient();

/**
 * Interface for the response object
 */
interface ClientResponse {
  meta: {
    count: number
    title: string
    url: string
  },
  data: Reward[]
}

/**
 * Function to get all people
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getRewards(req: Request, res: Response): Promise<void> {
  const rewards: Reward[] = await prisma.reward.findMany();
  const clientReponse: ClientResponse = {
    meta: {
      count: rewards.length,
      title: 'All rewards',
      url: req.url
    },
    data: rewards
  };
  res.status(200).send(clientReponse);
}

/**
 * Function to get a person by id
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getReward(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: number = parseInt(req.params.id);

  try {
    const reward: Reward = await prisma.reward.findUnique({
      where: {
        id: id
      }
    });
    console.log('reward:', reward);
    if (!reward) {
      throw new Error('Event not found', { cause: 404 });
    }
    res.json({ success: true, reward });
  } catch (err) {
    next(err); // forwards to error handler
  }
}
