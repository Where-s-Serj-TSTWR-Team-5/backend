import Express, { Router } from 'express';
import { getPlant, getPlants, setPlant } from '../controllers/plantsController.ts';
const router: Router = Express.Router();

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
//   next();
// });
router.get('/', getPlants);
router.get('/:id', getPlant);
router.post('/', setPlant);

export default router;
