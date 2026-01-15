import { prisma, EVENT_CATEGORIES } from '@database/prisma'

const eventLabels = Object.values(EVENT_CATEGORIES).map((category) => ({
  category,
}))

export const seedEventLabels = async (): Promise<void> => {
  try {
    for (const label of eventLabels) {
      await prisma.eventLabel.upsert({
        where: { category: label.category },
        update: {},
        create: label,
      })
    }
    console.log('✅ Event labels seeded')
  } catch (e) {
    console.error('❌ Error seeding event labels:', e)
    throw e
  }
}
