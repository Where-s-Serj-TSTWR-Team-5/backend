import Express, { Router } from 'express';
import { getEvent, getEvents, createEvent, updateEvent } from '../controllers/eventsController.ts';
const router: Router = Express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', createEvent);
router.put('/:id', updateEvent);

export default router;
