import Express, { Router } from 'express';
import { getPlant, getPlants, setPlant } from '../controllers/plantsController.js';
const router: Router = Express.Router();

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
//   next();
// });
router.get('/plants', getPlants);
router.get('/plants/:id', getPlant);
router.post('/plants', setPlant);

export default router;
