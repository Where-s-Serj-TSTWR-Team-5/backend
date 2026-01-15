import { prisma, Event } from '@database/prisma';

const events: Omit<Event, 'id'>[] = [
  {
    organizerId: 1,
    title: 'Spring Festival',
    description: 'Celebrate the arrival of spring with music, food, and fun activities for all ages.',
    thumbnail: 'https://picsum.photos/1200/800',
    banner: 'https://picsum.photos/1200/800',
    location: 'Vlissingen',
    startAt: new Date('2024-03-20T10:00:00'),
    endAt: new Date('2024-03-20T18:00:00'),
    date: new Date('2024-03-20'),
    studyPoints: 2,
    points: 2,
    labelId: 1,
    maxParticipants: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    organizerId: 2,
    title: 'Summer Beach Party',
    description: 'Join us for a day of sun, sand, and surf at our annual beach party. Live DJ, BBQ, and beach games!',
    thumbnail: 'https://picsum.photos/1200/800',
    banner: 'https://picsum.photos/1200/800',
    location: 'Zoutelande',
    startAt: new Date('2024-06-15T12:00:00'),
    endAt: new Date('2024-06-15T20:00:00'),
    date: new Date('2024-06-15'),
    studyPoints: 3,
    points: 2,
    labelId: 2,
    maxParticipants: 150,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    organizerId: 3,
    title: 'Autumn Art Fair',
    description: 'Explore local art and crafts at our autumn fair. Meet the artists, enjoy live demonstrations, and find unique pieces to take home.',
    thumbnail: 'https://picsum.photos/1200/800',
    banner: 'https://picsum.photos/1200/800',
    location: 'Arnemuiden',
    startAt: new Date('2024-09-10T09:00:00'),
    endAt: new Date('2024-09-10T17:00:00'),
    date: new Date('2024-09-10'),
    studyPoints: 2,
    points: 2,
    labelId: 3,
    maxParticipants: 80,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Export a seed function instead of running immediately
export const seedEvents = async (): Promise<void> => {
  try {
    await prisma.event.createMany({
      data: events,
      // skipDuplicates: true, // avoids unique constraint errors
    });
    console.log('Events seeded');
  } catch (e) {
    console.error('Error seeding events:', e);
    throw e;
  }
};
