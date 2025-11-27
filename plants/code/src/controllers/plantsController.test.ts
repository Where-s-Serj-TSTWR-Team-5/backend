import type { Request, Response } from 'express';
import { getPlants, prisma } from './plantsController';
import type { Plant } from '../../prisma/types';

// --- Fake req/res helpers ---

function createMockResponse() {
  const res: Partial<Response> = {};
  let statusCode = 200;
  let body: any = undefined;

  res.status = (code: number) => {
    statusCode = code;
    return res as Response;
  };

  res.send = (data: any) => {
    body = data;
    return res as Response;
  };

  return {
    res: res as Response,
    getStatus: () => statusCode,
    getBody: () => body,
  };
}

function createMockRequest(url: string = '/plants'): Request {
  return {
    url,
  } as Request;
}

// --- Tests ---

async function test_getPlants_success() {
  console.log('Running: test_getPlants_success');

  // Arrange: mock prisma.plant.findMany
  const fakePlants: Plant[] = [
    { id: 1, name: 'Tomato' } as Plant,
    { id: 2, name: 'Strawberry' } as Plant,
  ];

  // @ts-ignore – we know plant exists at runtime
  const originalFindMany = prisma.plant.findMany;
  // @ts-ignore
  prisma.plant.findMany = async () => fakePlants;

  const req = createMockRequest('/plants');
  const { res, getStatus, getBody } = createMockResponse();

  // Act
  await getPlants(req, res);

  // Assert
  if (getStatus() !== 200) {
    throw new Error(`Expected status 200, got ${getStatus()}`);
  }

  const body = getBody();
  if (!body || body.meta?.count !== fakePlants.length) {
    throw new Error(`Expected meta.count ${fakePlants.length}, got ${JSON.stringify(body)}`);
  }

  if (!Array.isArray(body.data) || body.data.length !== 2) {
    throw new Error(`Expected 2 plants in data, got ${body.data?.length}`);
  }

  console.log('✅ PASS: test_getPlants_success');

  // Restore original method
  // @ts-ignore
  prisma.plant.findMany = originalFindMany;
}

async function test_getPlants_error() {
  console.log('Running: test_getPlants_error');

  // Arrange: make prisma throw
  // @ts-ignore
  const originalFindMany = prisma.plant.findMany;
  // @ts-ignore
  prisma.plant.findMany = async () => {
    throw new Error('DB error');
  };

  const req = createMockRequest('/plants');
  const { res, getStatus, getBody } = createMockResponse();

  // Act
  await getPlants(req, res);

  // Assert
  if (getStatus() !== 500) {
    throw new Error(`Expected status 500, got ${getStatus()}`);
  }

  const body = getBody();
  if (!body || body.error?.code !== 'SERVER_ERROR') {
    throw new Error(`Expected error.code SERVER_ERROR, got ${JSON.stringify(body)}`);
  }

  console.log('✅ PASS: test_getPlants_error');

  // Restore
  // @ts-ignore
  prisma.plant.findMany = originalFindMany;
}

// --- Simple runner ---
(async () => {
  try {
    await test_getPlants_success();
    await test_getPlants_error();
    console.log('🎉 All tests finished successfully');
  } catch (err) {
    console.error('❌ TEST FAILED:', err);
    process.exit(1);
  }
})();
