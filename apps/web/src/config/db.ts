import { PrismaClient } from '@prisma/client'

export const postgres = new PrismaClient({
  log: ['query'],
})
