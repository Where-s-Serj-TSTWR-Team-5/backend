import Express, { Router } from 'express';
import { getEvent, getEvents, createEvent, deleteEvent } from '../controllers/eventsController.ts';
const router: Router = Express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);

export default router;
