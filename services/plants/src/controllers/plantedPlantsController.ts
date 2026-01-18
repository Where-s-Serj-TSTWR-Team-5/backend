import 'dotenv/config';
import { Request, Response } from 'express';
import { prisma } from '@database/prisma';

interface ErrorResponse {
  error: {
    message: string;
    code: string;
    url: string;
  };
}

/**
 * POST /planted-plants/:id/transfer
 * body: { newOwnerId: number, notes?: string }
 */
export async function transferPlantedPlantOwner(req: Request, res: Response): Promise<void> {
  try {
    const plantedPlantId = Number(req.params.id);
    const newOwnerId = Number(req.body?.newOwnerId);
    const notes = typeof req.body?.notes === 'string' ? req.body.notes : null;

    if (Number.isNaN(plantedPlantId)) {
      const errorResponse: ErrorResponse = {
        error: { message: 'Invalid plantedPlant ID', code: 'INVALID_ID', url: req.url }
      };
      res.status(400).json(errorResponse);
      return;
    }

    if (Number.isNaN(newOwnerId)) {
      const errorResponse: ErrorResponse = {
        error: { message: 'Invalid newOwnerId', code: 'VALIDATION_ERROR', url: req.url }
      };
      res.status(400).json(errorResponse);
      return;
    }

    // 1) Load plantedPlant
    const plantedPlant = await prisma.plantedPlant.findUnique({
      where: { id: plantedPlantId }
    });

    if (!plantedPlant) {
      const errorResponse: ErrorResponse = {
        error: {
          message: `PlantedPlant with ID ${plantedPlantId} not found`,
          code: 'NOT_FOUND',
          url: req.url
        }
      };
      res.status(404).json(errorResponse);
      return;
    }

    const plantId = plantedPlant.plantId;
    const oldOwnerId = plantedPlant.ownerId;

    if (oldOwnerId === newOwnerId) {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'New owner is the same as the current owner',
          code: 'VALIDATION_ERROR',
          url: req.url
        }
      };
      res.status(400).json(errorResponse);
      return;
    }

    // 2) Transaction: deactivate old history, update owner, create new active history row
    const [updatedPlantedPlant, newHistoryRow] = await prisma.$transaction([
      prisma.plantOwnerHistory.updateMany({
        where: { plantId, isActive: true },
        data: { isActive: false }
      }),

      prisma.plantedPlant.update({
        where: { id: plantedPlantId },
        data: { ownerId: newOwnerId }
      }),

      prisma.plantOwnerHistory.create({
        data: {
          plantId,
          ownerId: newOwnerId,
          notes,
          isActive: true
        }
      })
    ]).then((results) => {
      // results[0] is updateMany result; results[1] is plantedPlant; results[2] is history
      return [results[1], results[2]] as const;
    });

    res.status(200).json({
      meta: { title: 'Owner transferred', url: req.url },
      data: {
        plantedPlant: updatedPlantedPlant,
        ownerHistory: newHistoryRow
      }
    });
  } catch (error) {
    console.error('Failed to transfer planted plant owner:', error);

    const errorResponse: ErrorResponse = {
      error: {
        message: 'Failed to transfer owner',
        code: 'SERVER_ERROR',
        url: req.url
      }
    };

    res.status(500).json(errorResponse);
  }
}
