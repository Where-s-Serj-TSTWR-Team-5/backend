import "dotenv/config";
import { NextFunction, Request, Response } from 'express';
import { prisma, type Event } from '@database/prisma';
import { AuthenticatedRequest } from "@shared/middleware";

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
  labelId?: number;
}

/**
 * Function to get all events, including registrations count
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getEvents(req: Request, res: Response): Promise<void> {
  try {
    const events = await prisma.event.findMany({
      include: {
        label: true,
        registrations: {
          select: {
            userId: true,
          },
        },
      },
    });

    const eventsWithParticipants = events.map(event => ({
      ...event,
      currentParticipants: event.registrations.length,
    }));

    const clientResponse = {
      meta: {
        count: events.length,
        title: 'All events',
        url: req.url,
      },
      data: eventsWithParticipants,
    };

    res.status(200).send(clientResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
}

/**
 * Function to get an event by id, including registrations
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const id = Number(req.params.id);

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        label: true,
        organizer: true,
        registrations: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    const currentParticipants = event.registrations.length;

    res.json({
      success: true,
      event: {
        ...event,
        currentParticipants,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Function to create a new event
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @param next {NextFunction} - The Next function
 * @returns {Promise<void>}
 */
export async function createEvent(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
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
    labelId,
  } = req.body

  if (!startAt) {
    res.status(400).json({ success: false, message: 'startAt time is required.' })
    return
  }

  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  try {
    const defaultEndAt = new Date(
      new Date(startAt).getTime() + 60 * 60 * 1000
    )

    let resolvedLabelId: number | undefined

    if (labelId !== undefined) {
      const label = await prisma.eventLabel.findUnique({
        where: { id: Number(labelId) },
      })

      if (!label) {
        res.status(400).json({ message: 'Invalid labelId' })
        return
      }

      resolvedLabelId = label.id
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        location,
        description: description || 'No description provided.',
        thumbnail: thumbnail || '',
        banner: banner || '',
        studyPoints: studyPoints || 0,
        maxParticipants: maxParticipants || 100,
        points,
        startAt,
        endAt: endAt || defaultEndAt,
        date: startAt,
        organizerId: req.user.id,

        ...(resolvedLabelId !== undefined && {
          labelId: resolvedLabelId,
        }),
      },
    })

    res.status(201).json({
      success: true,
      event: newEvent,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Function to update an existing event
 * @param req {Request} - The Request object with event id in params
 * @param res {Response} - The Response object
 * @param next {NextFunction} - The Next function
 */
export async function updateEvent(
  req: Request<{ id: string }, unknown, Partial<CreateEventRequestBody>>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid Event ID' })
    return
  }

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
    labelId,
  } = req.body

  try {
    const existingEvent = await prisma.event.findUnique({ where: { id } })

    if (!existingEvent) {
      res.status(404).json({ success: false, message: 'Event not found' })
      return
    }

    let resolvedLabelId: number | null | undefined

    if (labelId !== undefined) {
      if (labelId === null) {
        resolvedLabelId = null
      } else {
        const label = await prisma.eventLabel.findUnique({
          where: { id: Number(labelId) },
        })

        if (!label) {
          res.status(400).json({ message: 'Invalid labelId' })
          return
        }

        resolvedLabelId = label.id
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
        thumbnail: thumbnail ?? undefined,
        banner: banner ?? undefined,
        location: location ?? undefined,
        startAt: startAt ?? undefined,
        endAt: endAt ?? undefined,
        studyPoints:
          studyPoints !== undefined ? Number(studyPoints) : undefined,
        points: points !== undefined ? Number(points) : undefined,
        maxParticipants:
          maxParticipants !== undefined
            ? Number(maxParticipants)
            : undefined,
        date: startAt ?? undefined,

        ...(resolvedLabelId !== undefined && {
          labelId: resolvedLabelId,
        }),
      },
    })

    res.status(200).json({
      success: true,
      event: updatedEvent,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Function to delete an event by ID
 */
export async function deleteEvent(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid Event ID' });
    return;
  }

  try {
    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    await prisma.event.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Event deleted' });

  } catch (err) {
    next(err);
  }
}

export async function toggleRegistration(req: AuthenticatedRequest, res: Response){
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required' });
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    // If registered → deregister
    if (existingRegistration) {
      await prisma.eventRegistration.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      return res.json({
        registered: false,
        message: 'Successfully deregistered from event',
      });
    }

    // Enforce maxParticipants
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (
      event.maxParticipants &&
      event.registrations.length >= event.maxParticipants
    ) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Register
    await prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
      },
    });

    return res.json({
      registered: true,
      message: 'Successfully registered for event',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};