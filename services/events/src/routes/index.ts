import Express, { Router } from 'express';
import { getEvent, getEvents, createEvent, deleteEvent } from '../controllers/eventsController.ts';
import { ROLES } from '@database/prisma';
// import { requireRole } from '@shared/middleware';
const router: Router = Express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);

export default router;
