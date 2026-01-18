import Express, { Router } from 'express';
import { getPlant, getPlants, setPlant, updatePlant, deletePlant, getPlantOwnerHistory, wateredToday } from '../controllers/plantsController.ts';

const router: Router = Express.Router();

router.get('/', getPlants);
router.get('/:id/owner-history', getPlantOwnerHistory);
router.get('/:id', getPlant);
// Protected route, user needs to be authenticated
router.post('/', setPlant);
router.post('/:id/watered-today', wateredToday);
router.put('/:id', updatePlant);
router.delete('/:id', deletePlant);

export default router;
