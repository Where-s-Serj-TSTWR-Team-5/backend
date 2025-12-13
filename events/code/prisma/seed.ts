import { PrismaClient } from '@prisma/client';
// reference a type from the generated Prisma Client
// import type { Client } from '@prisma/client';
const prisma: PrismaClient = new PrismaClient();
import { Event } from './types.ts';

// if you use the model you have to fill in all the fields also the generated ones
const events: Event[] = [
  {
    organizerId: 1,
    title: 'Spring Festival',
    description: 'Celebrate the arrival of spring with music, food, and fun activities for all ages.',
    thumbnail: 'spring_festival.jpg',
    banner: 'spring_festival_banner.jpg',
    location: 'Vlissingen',
    startAt: new Date('2024-03-20T10:00:00'),
    endAt: new Date('2024-03-20T18:00:00'),
    date: new Date('2024-03-20'),
    studyPoints: 2,
    maxParticipants: 100,
  },
  {
    organizerId: 2,
    title: 'Summer Beach Party',
    description: 'Join us for a day of sun, sand, and surf at our annual beach party. Live DJ, BBQ, and beach games!',
    thumbnail: 'beach_party.jpg',
    banner: 'beach_party_banner.jpg',
    location: 'Zoutelande',
    startAt: new Date('2024-06-15T12:00:00'),
    endAt: new Date('2024-06-15T20:00:00'),
    date: new Date('2024-06-15'),
    studyPoints: 3,
    maxParticipants: 150,
  },
  {
    organizerId: 3,
    title: 'Autumn Art Fair',
    description: 'Explore local art and crafts at our autumn fair. Meet the artists, enjoy live demonstrations, and find unique pieces to take home.',
    thumbnail: 'art_fair.jpg',
    banner: 'art_fair_banner.jpg',
    location: 'Arnemuiden',
    startAt: new Date('2024-09-10T09:00:00'),
    endAt: new Date('2024-09-10T17:00:00'),
    date: new Date('2024-09-10'),
    studyPoints: 2,
    maxParticipants: 80,
  }
];

// first look if the exist in the database and then add them

const load = async (): Promise<void> => {
  try {
    await prisma.event.createMany({
      data: events,
    });
    console.log('Added category data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
