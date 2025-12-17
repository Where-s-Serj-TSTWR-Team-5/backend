import Express, { Router } from 'express';
import { getEvent, getEvents, createEvent } from '../controllers/eventsController.ts';
const router: Router = Express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', createEvent);

export default router;
