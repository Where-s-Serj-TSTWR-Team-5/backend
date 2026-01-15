import { prisma, EventLabel } from '@database/prisma'

const eventLabels: Omit<EventLabel, 'id'>[] = [
  { category: "🌱 sustainability" },
  { category: "🌿 gardening" },
  { category: "🔨 workshops" },
  { category: "🧹 clean-up" },
]

export const seedEventLabels = async (): Promise<void> => {
  try {
    await prisma.eventLabel.createMany({
      data: eventLabels,
    })

    console.log('✅ Event labels seeded')
  } catch (e) {
    console.error('❌ Error seeding event labels:', e)
    throw e
  }
}
