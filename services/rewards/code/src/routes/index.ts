import Express, { Router } from 'express';
import { getReward, getRewards } from '../controllers/rewardsController.ts';
const router: Router = Express.Router();

router.get('/', getRewards);
router.get('/:id', getReward);
export default router;
