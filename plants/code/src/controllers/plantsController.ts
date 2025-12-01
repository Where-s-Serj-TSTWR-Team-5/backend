import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Plant } from '../../prisma/types';

export const prisma: PrismaClient = new PrismaClient();

/**
 * Response shape for a list of plants
 */
interface PlantListResponse {
  meta: {
    count: number;
    title: string;
    url: string;
  };
  data: Plant[];
}

/**
 * Response shape for a single plant
 */
interface PlantSingleResponse {
  meta: {
    title: string;
    url: string;
  };
  data: Plant;
}

/**
 * Error response shape
 */
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    url: string;
  };
}

/**
 * Get all plants
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getPlants(req: Request, res: Response): Promise<void> {
  try {
    const plants = await prisma.plant.findMany();

    const plantResponse: PlantListResponse = {
      meta: {
        count: plants.length,
        title: 'All plants',
        url: req.url,
      },
      data: plants as Plant[],
    };

    res.status(200).json(plantResponse);
  } catch (error) {
    console.error('Failed to retrieve plants:', error);

    const errorResponse: ErrorResponse = {
      error: {
        message: 'Failed to retrieve plants',
        code: 'SERVER_ERROR',
        url: req.url,
      },
    };

    res.status(500).json(errorResponse);
  }
}

/**
 * Get a plant by id
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getPlant(req: Request, res: Response): Promise<void> {
  try {
    const id: number = Number(req.params.id);

    if (Number.isNaN(id)) {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'Invalid plant ID',
          code: 'INVALID_ID',
          url: req.url,
        },
      };

      res.status(400).json(errorResponse);
      return;
    }

    const plant = await prisma.plant.findUnique({
      where: { id },
    });

    if (!plant) {
      const errorResponse: ErrorResponse = {
        error: {
          message: `Plant with ID ${id} not found`,
          code: 'NOT_FOUND',
          url: req.url,
        },
      };

      res.status(404).json(errorResponse);
      return;
    }

    const response: PlantSingleResponse = {
      meta: {
        title: `Plant ${id}`,
        url: req.url,
      },
      data: plant as Plant,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to retrieve plant:', error);

    const errorResponse: ErrorResponse = {
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR',
        url: req.url,
      },
    };

    res.status(500).json(errorResponse);
  }
}

/**
 * Create a new plant
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function setPlant(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      scientificName,
      description,
      sunlightRequirement,
      waterNeeds,
      image,
      plantTypeID,
    } = req.body;

    // Basic validation: name is required
    if (!name || typeof name !== 'string') {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'Plant name is required',
          code: 'VALIDATION_ERROR',
          url: req.url,
        },
      };

      res.status(400).json(errorResponse);
      return;
    }

    const newPlant = await prisma.plant.create({
      data: {
        name,
        scientificName,
        description,
        sunlightRequirement,
        waterNeeds,
        image,
        plantTypeID,
      },
    });

    const response: PlantSingleResponse = {
      meta: {
        title: 'Plant created',
        url: req.url,
      },
      data: newPlant as Plant,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Failed to create plant:', error);

    const errorResponse: ErrorResponse = {
      error: {
        message: 'Failed to create plant',
        code: 'SERVER_ERROR',
        url: req.url,
      },
    };

    res.status(500).json(errorResponse);
  }
}
