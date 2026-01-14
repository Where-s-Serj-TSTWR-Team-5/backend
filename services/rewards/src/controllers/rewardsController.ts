import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { prisma, type Reward } from "@database/prisma";
import { AuthenticatedRequest } from "@shared/middleware";

/**
 * Interface for the response object
 */
interface ClientResponse {
  meta: {
    count: number;
    title: string;
    url: string;
  };
  data: Reward[];
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
      title: "All rewards",
      url: req.url,
    },
    data: rewards,
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
  const id: number = Number(req.params.id);

  try {
    const reward: Reward | null = await prisma.reward.findUnique({
      where: {
        id: id,
      },
    });
    if (!reward) {
      throw new Error("Reward not found", { cause: 404 });
    }
    res.json({ success: true, reward });
  } catch (err) {
    next(err);
  }
}

export async function purchaseReward(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const rewardId: number = Number(req.params.id);

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;
  const TRANSACTION_FEE = 1;

  try {
    const [reward, user] = await Promise.all([prisma.reward.findUnique({ where: { id: rewardId } }), prisma.user.findUnique({ where: { id: userId } })]);

    if (!reward) throw new Error("Reward not found", { cause: 404 });
    if (!user) throw new Error("User not found", { cause: 404 });

    const totalCost = reward.requiredPoints + TRANSACTION_FEE;

    if (user.points < totalCost) {
      throw new Error(`Insufficient points. You need ${totalCost} points total.`, { cause: 400 });
    }

    const [updatedUser, purchase] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          points: { decrement: totalCost },
        },
      }),
      prisma.pendingReward.create({
        data: {
          userId: userId,
          rewardId: rewardId,
        },
        include: {
          reward: true,
        },
      }),
    ]);

    res.json({
      success: true,
      message: `Successfully purchased ${reward.title}!`,
      newBalance: updatedUser.points,
      purchase: purchase,
    });
  } catch (err) {
    next(err);
  }
}
