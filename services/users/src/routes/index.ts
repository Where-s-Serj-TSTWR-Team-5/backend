import Express, { Router } from 'express';
import { getUsers, getUser, loginUser, getCurrentUser, logoutUser } from '../controllers/usersController.js';
const router: Router = Express.Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', getUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
