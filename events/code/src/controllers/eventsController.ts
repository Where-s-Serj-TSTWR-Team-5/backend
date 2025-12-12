import { NextFunction, Request, Response } from 'express';
// import { PrismaClient } from '../../node_modules/.prisma/client.ts';
// import { PrismaClient } from '../../node_modules/.prisma/client/default.js';
import { PrismaClient } from '@prisma/client';
import { Event } from '../../prisma/types.ts';
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
  data: Event[]
}

/**
 * Function to get all people
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getEvents(req: Request, res: Response): Promise<void> {
  const events: Event[] = await prisma.event.findMany();
  const clientReponse: ClientResponse = {
    meta: {
      count: events.length,
      title: 'All events',
      url: req.url
    },
    data: events
  };
  res.status(200).send(clientReponse);
}

/**
 * Function to get a person by id
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: number = parseInt(req.params.id);

  try {
    const event: Event = await prisma.event.findUnique({
      where: {
        id: id
      }
    });
    console.log('event:', event);
    if (!event) {
      throw new Error('Event not found', { cause: 404 });
    }
    res.json({ success: true, event });
  } catch (err) {
    next(err); // forwards to error handler
  }
}
