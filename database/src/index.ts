export { prisma } from './prismaClient.js';
export type { Event, User, Plant, Reward, EventLabel } from '@prisma/client';

export const ROLES = {
  USER: "USER",
  GREEN_OFFICE_MEMBER: "GREEN_OFFICE_MEMBER",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const EVENT_CATEGORIES = {
  SUSTAINABILITY: 'SUSTAINABILITY',
  GARDENING: 'GARDENING',
  WORKSHOP: 'WORKSHOP',
  CLEAN_UP: 'CLEAN_UP',
} as const;
