import { postgresClientSingleton } from '@/lib/prisma'

declare global {
  // eslint-disable-next-line no-var
  var postgresClient: undefined | ReturnType<typeof postgresClientSingleton>
}
