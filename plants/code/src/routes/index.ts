import Express, { Router } from 'express';
import { getPlant, getPlants, setPlant, updatePlant, deletePlant } from '../controllers/plantsController.js';

const router: Router = Express.Router();

router.get('/plants', getPlants);
router.get('/plants/:id', getPlant);
router.post('/plants', setPlant);
router.put('/plants/:id', updatePlant);
router.delete('/plants/:id', deletePlant);


export default router;
