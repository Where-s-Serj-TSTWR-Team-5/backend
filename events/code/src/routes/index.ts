import Express, { Router } from 'express';
import { getEvent, getEvents } from '../controllers/eventsController.ts';
const router: Router = Express.Router();

router.get('/events', getEvents);
router.get('/events/:id', getEvent);

export default router;
