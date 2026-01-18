import Express, { Router } from 'express';
import { transferPlantedPlantOwner } from '../controllers/plantedPlantsController.js';

const router: Router = Express.Router();

// Transfer ownership + write PlantOwnerHistory
router.post('/:id/transfer', transferPlantedPlantOwner);

export default router;
