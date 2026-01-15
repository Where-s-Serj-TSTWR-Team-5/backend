export { prisma } from './prismaClient.js';
export type { Event, User, Plant, Reward } from '@prisma/client';
export declare const ROLES: {
    readonly USER: "USER";
    readonly GREEN_OFFICE_MEMBER: "GREEN_OFFICE_MEMBER";
};
export type Role = (typeof ROLES)[keyof typeof ROLES];
export declare const EVENT_CATEGORIES: {
    readonly SUSTAINABILITY: "SUSTAINABILITY";
    readonly GARDENING: "GARDENING";
    readonly WORKSHOP: "WORKSHOP";
    readonly CLEAN_UP: "CLEAN_UP";
};
export type EventCategory = (typeof EVENT_CATEGORIES)[keyof typeof EVENT_CATEGORIES];
