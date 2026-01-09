export { prisma } from './prismaClient.js';
export type { Event, User, Plant, Reward, EventRegistration } from '@prisma/client';
export declare const ROLES: {
    readonly USER: "USER";
    readonly GREEN_OFFICE_MEMBER: "GREEN_OFFICE_MEMBER";
};
export type Role = (typeof ROLES)[keyof typeof ROLES];
