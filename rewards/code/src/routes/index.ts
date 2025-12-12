import Express, { Router } from 'express';
import { getReward, getRewards } from '../controllers/rewardsController.ts';
const router: Router = Express.Router();

router.get('/rewards', getRewards);
router.get('/rewards/:id', getReward);
export default router;
