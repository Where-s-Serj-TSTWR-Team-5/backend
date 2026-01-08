import Express, { Router } from 'express';
import { getReward, getRewards } from '../controllers/rewardsController.js';
const router: Router = Express.Router();

router.get('/', getRewards);
router.get('/:id', getReward);
export default router;
