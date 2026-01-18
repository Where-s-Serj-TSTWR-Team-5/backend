import "dotenv/config";
import {Request, Response} from 'express';
import {prisma} from '@database/prisma';
import type {Prisma}
from '@prisma/client';

type PlantWithRelations = Prisma.PlantGetPayload < {
    include: {
        plantType: true;
        plantedPlants: true;
    };
} >;

/**
 * Response shape for a list of plants
 */
interface PlantListResponse {
    meta: {
        count: number;
        title: string;
        url: string;
    };
    data: PlantWithRelations[];
}

/**
 * Response shape for a single plant
 */
interface PlantSingleResponse {
    meta: {
        title: string;
        url: string;
    };
    data: PlantWithRelations;
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
 * GET /plants/:id/owner-history
 */
export async function getPlantOwnerHistory(req: Request, res: Response): Promise<void> {
  try {
    const plantId = Number(req.params.id);

    if (Number.isNaN(plantId)) {
      const errorResponse: ErrorResponse = {
        error: { message: 'Invalid plant ID', code: 'INVALID_ID', url: req.url }
      };
      res.status(400).json(errorResponse);
      return;
    }

    const history = await prisma.plantOwnerHistory.findMany({
      where: { plantId },
      orderBy: { id: 'desc' },
      include: {
        owner: true
      }
    });

    res.status(200).json({
      meta: {
        count: history.length,
        title: `Owner history for plant ${plantId}`,
        url: req.url
      },
      data: history
    });
  } catch (error) {
    console.error('Failed to retrieve owner history:', error);

    const errorResponse: ErrorResponse = {
      error: {
        message: 'Failed to retrieve owner history',
        code: 'SERVER_ERROR',
        url: req.url
      }
    };

    res.status(500).json(errorResponse);
  }
}

/**
 * Get all plants
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getPlants(req : Request, res : Response): Promise<void> {
    try {
        const plants = await prisma
            .plant
            .findMany({
                include: {
                    plantType: true,
                    plantedPlants: {
                        orderBy: {
                            plantedAt: 'desc'
                        },
                        take: 1
                    }

                }

            });

        const plantResponse: PlantListResponse = {
            meta: {
                count: plants.length,
                title: 'All plants',
                url: req.url
            },
            data: plants
        };

        res
            .status(200)
            .json(plantResponse);
    } catch (error) {
        console.error('Failed to retrieve plants:', error);

        const errorResponse: ErrorResponse = {
            error: {
                message: 'Failed to retrieve plants',
                code: 'SERVER_ERROR',
                url: req.url
            }
        };

        res
            .status(500)
            .json(errorResponse);
    }
}

/**
 * Get a plant by id
 * @param req {Request} - The Request object
 * @param res {Response} - The Response object
 * @returns {Promise<void>}
 */
export async function getPlant(req : Request, res : Response): Promise<void> {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            const errorResponse: ErrorResponse = {
                error: {
                    message: 'Invalid plant ID',
                    code: 'INVALID_ID',
                    url: req.url
                }
            };

            res
                .status(400)
                .json(errorResponse);
            return;
        }

        const plant = await prisma
            .plant
            .findUnique({
                where: {
                    id
                },
                include: {
                    plantType: true,
                    plantedPlants: {
                        orderBy: {
                            plantedAt: 'desc'
                        },
                        take: 1
                    }
                }
            });

        if (!plant) {
            const errorResponse: ErrorResponse = {
                error: {
                    message: `Plant with ID ${id} not found`,
                    code: 'NOT_FOUND',
                    url: req.url
                }
            };

            res
                .status(404)
                .json(errorResponse);
            return;
        }

        const response: PlantSingleResponse = {
            meta: {
                title: `Plant ${id}`,
                url: req.url
            },
            data: plant
        };

        res
            .status(200)
            .json(response);
    } catch (error) {
        console.error('Failed to retrieve plant:', error);

        const errorResponse: ErrorResponse = {
            error: {
                message: 'Internal server error',
                code: 'SERVER_ERROR',
                url: req.url
            }
        };

        res
            .status(500)
            .json(errorResponse);
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
    const { name, scientificName, description, image, plantTypeID } = req.body;

    // Basic validation: name is required
    if (!name || typeof name !== 'string') {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'Plant name is required',
          code: 'VALIDATION_ERROR',
          url: req.url
        }
      };

      res.status(400).json(errorResponse);
      return;
    }

    // 1) Create the plant (this returns a "plain" Plant)
    const created = await prisma.plant.create({
      data: {
        name,
        scientificName,
        description,
        image,
        plantTypeID
      }
    });

    // 2) Fetch again with relations so it matches PlantWithRelations
    const newPlant = await prisma.plant.findUnique({
      where: { id: created.id },
      include: {
        plantType: true,
        plantedPlants: {
          orderBy: { plantedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!newPlant) {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'Failed to load created plant',
          code: 'SERVER_ERROR',
          url: req.url
        }
      };

      res.status(500).json(errorResponse);
      return;
    }

    const response: PlantSingleResponse = {
      meta: {
        title: 'Plant created',
        url: req.url
      },
      data: newPlant
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Failed to create plant:', error);

    const errorResponse: ErrorResponse = {
      error: {
        message: 'Failed to create plant',
        code: 'SERVER_ERROR',
        url: req.url
      }
    };

    res.status(500).json(errorResponse);
  }
}


/*
  * Update an existing plant
  * @param req {Request} - The Request object
  * @param res {Response} - The Response object
  * @returns {Promise<void>}
  */
export async function updatePlant(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'Invalid plant ID',
          code: 'INVALID_ID',
          url: req.url
        }
      };

      res.status(400).json(errorResponse);
      return;
    }

    const { name, scientificName, description, image, plantTypeID } = req.body;

    if (!name || typeof name !== 'string') {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'Plant name is required',
          code: 'VALIDATION_ERROR',
          url: req.url
        }
      };

      res.status(400).json(errorResponse);
      return;
    }

    const existingPlant = await prisma.plant.findUnique({ where: { id } });

    if (!existingPlant) {
      const errorResponse: ErrorResponse = {
        error: {
          message: `Plant with ID ${id} not found`,
          code: 'NOT_FOUND',
          url: req.url
        }
      };

      res.status(404).json(errorResponse);
      return;
    }

    // 1) Update the plant (returns a "plain" Plant)
    const updated = await prisma.plant.update({
      where: { id },
      data: {
        name,
        scientificName,
        description,
        image,
        plantTypeID
      }
    });

    // 2) Fetch again with relations so it matches PlantWithRelations
    const updatedPlant = await prisma.plant.findUnique({
      where: { id: updated.id },
      include: {
        plantType: true,
        plantedPlants: {
          orderBy: { plantedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!updatedPlant) {
      const errorResponse: ErrorResponse = {
        error: {
          message: 'Failed to load updated plant',
          code: 'SERVER_ERROR',
          url: req.url
        }
      };

      res.status(500).json(errorResponse);
      return;
    }

    const response: PlantSingleResponse = {
      meta: {
        title: `Plant ${updatedPlant.name} updated`,
        url: req.url
      },
      data: updatedPlant
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to update plant:', error);

    const errorResponse: ErrorResponse = {
      error: {
        message: 'Failed to update plant',
        code: 'SERVER_ERROR',
        url: req.url
      }
    };

    res.status(500).json(errorResponse);
  }
}


export async function deletePlant(req : Request, res : Response): Promise<void> {
    try {
        const id: number = Number(req.params.id);

        if (Number.isNaN(id)) {
            const errorResponse: ErrorResponse = {
                error: {
                    message: 'Invalid plant ID',
                    code: 'INVALID_ID',
                    url: req.url
                }
            };

            res
                .status(400)
                .json(errorResponse);
            return;
        }

        const existingPlant = await prisma
            .plant
            .findUnique({where: {
                    id
                }});

        if (!existingPlant) {
            const errorResponse: ErrorResponse = {
                error: {
                    message: `Plant with ID ${id} not found`,
                    code: 'NOT_FOUND',
                    url: req.url
                }
            };

            res
                .status(404)
                .json(errorResponse);
            return;
        }

        await prisma
            .plant
            .delete({where: {
                    id
                }});

        // standard REST delete: no content
        res
            .status(204)
            .send();
    } catch (error) {
        console.error('Failed to delete plant:', error);

        const errorResponse: ErrorResponse = {
            error: {
                message: 'Failed to delete plant',
                code: 'SERVER_ERROR',
                url: req.url
            }
        };

        res
            .status(500)
            .json(errorResponse);
    }
}

/**
 * POST /plants/:id/watered-today
 * Sets the latest plantedPlant waterLevel to 0 (Healthy)
 */
export async function wateredToday(req: Request, res: Response): Promise<void> {
  try {
    const plantId = Number(req.params.id);

    if (Number.isNaN(plantId)) {
      const errorResponse: ErrorResponse = {
        error: { message: 'Invalid plant ID', code: 'INVALID_ID', url: req.url }
      };
      res.status(400).json(errorResponse);
      return;
    }

    // find latest plantedPlant (same ordering style you already use)
    const latestPlanted = await prisma.plantedPlant.findFirst({
      where: { plantId },
      orderBy: { plantedAt: 'desc' }, // or createdAt if you prefer
      take: 1
    });

    if (!latestPlanted) {
      const errorResponse: ErrorResponse = {
        error: {
          message: `No planted plant found for plant ID ${plantId}`,
          code: 'NOT_FOUND',
          url: req.url
        }
      };
      res.status(404).json(errorResponse);
      return;
    }

    // update water level
    await prisma.plantedPlant.update({
      where: { id: latestPlanted.id },
      data: { waterLevel: 0 }
    });

    // return the plant with relations (same shape as getPlant)
    const updatedPlant = await prisma.plant.findUnique({
      where: { id: plantId },
      include: {
        plantType: true,
        plantedPlants: {
          orderBy: { plantedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!updatedPlant) {
      const errorResponse: ErrorResponse = {
        error: { message: `Plant with ID ${plantId} not found`, code: 'NOT_FOUND', url: req.url }
      };
      res.status(404).json(errorResponse);
      return;
    }

    const response: PlantSingleResponse = {
      meta: {
        title: `Plant ${plantId} watered today`,
        url: req.url
      },
      data: updatedPlant
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to set watered today:', error);

    const errorResponse: ErrorResponse = {
      error: {
        message: 'Failed to set watered today',
        code: 'SERVER_ERROR',
        url: req.url
      }
    };

    res.status(500).json(errorResponse);
  }
}
