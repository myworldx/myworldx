import { PrismaClient } from '../../node_modules/@prisma-postgres/client'

export const postgres = new PrismaClient({
  log: ['query'],
})
