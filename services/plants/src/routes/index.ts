import Express, { Router } from 'express';
import { getPlant, getPlants, setPlant, updatePlant, deletePlant } from '../controllers/plantsController.js';

const router: Router = Express.Router();

router.get('/', getPlants);
router.get('/:id', getPlant);
// Protected route, user needs to be authenticated
router.post('/', setPlant);
router.put('/:id', updatePlant);
router.delete('/:id', deletePlant);

export default router;
