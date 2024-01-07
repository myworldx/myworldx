import { repository } from '../../../src/repositories'
import { factory } from '../../factory'
import { database } from './utils/database'

describe('REPOSITORIES - installation', () => {
  beforeAll(async () => {
    Promise.resolve(await database.clear())
  })

  test('Create new installation', async () => {
    try {
      const payload = factory.payload.installation()

      const log = await repository.installation.create(payload)

      expect(log?.githubId).toEqual(payload.installation.id)
    } catch (error) {
      console.error(error)
      expect(error).toBeFalsy()
    }
  })
})
