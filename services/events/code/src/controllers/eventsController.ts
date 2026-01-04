import { NextFunction, Request, Response } from 'express';
import { prisma, type Event } from '@database/prisma';

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
 * Interface for the request body when creating an Event
 */
interface CreateEventRequestBody {
  title: string;
  description?: string;
  thumbnail?: string;
  banner?: string;
  location: string;
  startAt: string;
  endAt?: string;
  studyPoints?: number;
  points?: number;
  maxParticipants?: number;
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
    const event: Event | null = await prisma.event.findUnique({
      where: {
        id: id
      }
    });
    if (!event) {
      throw new Error('Event not found', { cause: 404 });
    }
    res.json({ success: true, event });
  } catch (err) {
    next(err); // forwards to error handler
  }
}

/**
 * Function to create a new event
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @param next {NextFunction} - The Next function
 * @returns {Promise<void>}
 */
export async function createEvent(req: Request<unknown, unknown, CreateEventRequestBody>, res: Response, next: NextFunction): Promise<void> {
  const {
    title,
    description,
    thumbnail,
    banner,
    location,
    startAt,
    endAt,
    studyPoints,
    points,
    maxParticipants,
  } = req.body;

  if (!startAt) {
    res.status(400).json({ success: false, message: 'startAt time is required.' });
    return;
  }

  try {
    // Calculate 1 hour default if not provided
    const defaultEndAt = new Date(new Date(startAt).getTime() + 60 * 60 * 1000);

    const newEvent = await prisma.event.create({
      data: {
        title: title,
        location: location,
        description: description || 'No description provided.',
        thumbnail: thumbnail || '',
        banner: banner || '',
        studyPoints: studyPoints || 0,
        maxParticipants: maxParticipants || 100,
        points: points,
        startAt: startAt,
        endAt: endAt || defaultEndAt,
        date: startAt,
        organizerId: 1,
      }
    });

    res.status(201).json({
      success: true,
      event: newEvent
    });

  } catch (err) {
    next(err);
  }
}