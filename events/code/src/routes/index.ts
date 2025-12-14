import Express, { Router } from 'express';
import { getEvent, getEvents } from '../controllers/eventsController.ts';
const router: Router = Express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);

export default router;
