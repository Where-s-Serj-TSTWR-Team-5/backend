import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Plant } from '../../prisma/types.ts';
const prisma: PrismaClient = new PrismaClient();

/**
 * Interface for the response object
 */
interface PlantResponse {
  meta: {
    count: number;
    title: string;
    url: string;
  };
  data: Plant[];
}


/**
 * Function to get all people
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getPlants(req: Request, res: Response): Promise<void> {
  try {
    const plants: Plant[] = await prisma.plant.findMany() as Plant[];
    const plantResponse: PlantResponse = {
      meta: {
        count: plants.length,
        title: 'All plants',
        url: req.url
      },
      data: plants
    };
    res.status(200).send(plantResponse);
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Failed to retrieve plants',
        code: 'SERVER_ERROR',
        url: req.url
      }
    });
  }
}

/**
 * Function to get a person by id
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getPlant(req: Request, res: Response): Promise<void> {
  try {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).send({
        error: {
          message: 'Invalid plant ID',
          code: 'INVALID_ID',
          url: req.url
        }
      });
      return;
    }
    const plant: Plant | null = await prisma.plant.findUnique({
      where: { id }
    }) as Plant | null;
    if (!plant) {
      res.status(404).send({
        error: {
          message: `Plant with ID ${id} not found`,
          code: 'NOT_FOUND',
          url: req.url
        }
      });
      return;
    }
    res.status(200).send(plant);
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR',
        url: req.url
      }
    });
  }
}

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

    const newPlant: Plant = await prisma.plant.create({
      data: {
        name,
        scientificName,
        description,
        sunlightRequirement,
        waterNeeds,
        image,
        plantTypeID,
      },
    }) as Plant;
    res.status(201).send(newPlant);
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Failed to create plant',
        code: 'SERVER_ERROR',
        url: req.url
      }
    });
  }
}
