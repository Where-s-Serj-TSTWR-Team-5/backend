import Express, { Router } from 'express';
import { getEvent, getEvents, createEvent, deleteEvent, toggleRegistration } from '../controllers/eventsController.ts';
import { ROLES } from '@database/prisma';
import { requireRole, authenticate } from '@shared/middleware';
const router: Router = Express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', authenticate, requireRole(ROLES.GREEN_OFFICE_MEMBER), createEvent);
router.delete('/:id', authenticate, requireRole(ROLES.GREEN_OFFICE_MEMBER), deleteEvent);
router.post('/toggleRegistration', authenticate, toggleRegistration);
export default router;
