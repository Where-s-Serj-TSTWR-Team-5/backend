import Express, { Router } from 'express';
import { getUsers, getUser } from '../controllers/usersController.ts';
const router: Router = Express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUser);
export default router;
