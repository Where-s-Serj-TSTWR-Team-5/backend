export { prisma } from './prismaClient.js';
export type { Prisma, PrismaClient, Event, User, Plant, Reward, PlantOwnerHistory } from '@prisma/client';
export declare const ROLES: {
    readonly USER: "USER";
    readonly GREEN_OFFICE_MEMBER: "GREEN_OFFICE_MEMBER";
};
export type Role = (typeof ROLES)[keyof typeof ROLES];
