import Express, { Router } from 'express';
import { getReward, getRewards, purchaseReward } from '../controllers/rewardsController.js';
import { requireRole, authenticate } from '@shared/middleware';
const router: Router = Express.Router();


router.get('/', getRewards);
router.get('/:id', getReward);
router.post('/purchase/:id', authenticate, purchaseReward)

export default router;
