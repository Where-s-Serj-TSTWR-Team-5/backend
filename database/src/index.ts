export { prisma } from './prismaClient.js';
export type { Event, User, Plant, Reward } from '@prisma/client';

export const ROLES = {
  USER: "USER",
  GREEN_OFFICE_MEMBER: "GREEN_OFFICE_MEMBER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
