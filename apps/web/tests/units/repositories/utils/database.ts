import { postgres } from '@/lib/prisma'
import { Prisma } from '@prisma-postgres/client'
import { exec } from 'child_process'
import * as util from 'util'

const execPromisify = util.promisify(exec)

const tables = Prisma.dmmf.datamodel.models.map((model) => model.dbName)

const reset = async () => execPromisify('npx prisma migrate reset --force --skip-seed')

const clear = async () => {
  await postgres.$transaction([...tables.map((table) => postgres.$executeRawUnsafe(`TRUNCATE ${table} CASCADE;`))])
}

const database = {
  reset,
  clear,
}

export { database }
