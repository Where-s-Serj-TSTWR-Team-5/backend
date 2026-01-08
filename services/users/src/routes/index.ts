import Express, { Router } from 'express';
import { getUsers, getUser, loginUser } from '../controllers/usersController.js';
const router: Router = Express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/login', loginUser);

export default router;
