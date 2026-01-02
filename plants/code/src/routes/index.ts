import Express, { Router } from 'express';
import { getPlant, getPlants, setPlant, updatePlant, deletePlant } from '../controllers/plantsController.js';

const router: Router = Express.Router();

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json('hi');
//   next();
// });
router.get('/', getPlants);
router.get('/:id', getPlant);
router.post('/', setPlant);
router.put('/:id', updatePlant);
router.delete('/:id', deletePlant);

export default router;
