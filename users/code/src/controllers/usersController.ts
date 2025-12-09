import { NextFunction, Request, Response } from 'express';
// import { PrismaClient } from '../../node_modules/.prisma/client.ts';
// import { PrismaClient } from '../../node_modules/.prisma/client/default.js';
import { PrismaClient } from '@prisma/client';
import { User } from '../../prisma/types.ts';
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
  data: User[]
}

/**
 * Function to get all people
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getUsers(req: Request, res: Response): Promise<void> {
  const users: User[] = await prisma.user.findMany();
  const clientReponse: ClientResponse = {
    meta: {
      count: users.length,
      title: 'All users',
      url: req.url
    },
    data: users
  };
  res.status(200).send(clientReponse);
}

/**
 * Function to get a person by id
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: number = parseInt(req.params.id);

  try {
    const user: User = await prisma.user.findUnique({
      where: {
        id: id
      }
    });
    console.log('event:', user);
    if (!user) {
      throw new Error('Event not found', { cause: 404 });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err); // forwards to the error handler
  }
}
