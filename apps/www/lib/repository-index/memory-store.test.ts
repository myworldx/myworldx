import { describe, expect, it } from 'vitest'

import { createIndexedLister } from '@/lib/accounts'

import { createMemoryRepositoryIndex } from './memory-store'
import { applyOperations } from './store'

describe('createMemoryRepositoryIndex', () => {
  it('distinguishes an account it has never seen from one with no repositories', async () => {
    const index = createMemoryRepositoryIndex()

    expect(await index.listRepositories('raferdev')).toBeNull()

    await index.apply({ kind: 'set', login: 'raferdev', repositories: [] })
    expect(await index.listRepositories('raferdev')).toEqual([])
  })

  it('replaces the list on set and keeps it sorted', async () => {
    const index = createMemoryRepositoryIndex({ raferdev: ['old.post'] })

    await index.apply({ kind: 'set', login: 'raferdev', repositories: ['notes.blog', 'a.index'] })
    expect(await index.listRepositories('raferdev')).toEqual(['a.index', 'notes.blog'])
  })

  it('adds without duplicating and removes what it holds', async () => {
    const index = createMemoryRepositoryIndex({ raferdev: ['notes.blog'] })

    await applyOperations(index, [
      { kind: 'add', login: 'raferdev', repositories: ['notes.blog', 'guides.project'] },
      { kind: 'remove', login: 'raferdev', repositories: ['notes.blog', 'never-there'] },
    ])

    expect(await index.listRepositories('raferdev')).toEqual(['guides.project'])
  })

  it('creates the account when adding to one it has not seen', async () => {
    const index = createMemoryRepositoryIndex()

    await index.apply({ kind: 'add', login: 'raferdev', repositories: ['notes.blog'] })
    expect(await index.listRepositories('raferdev')).toEqual(['notes.blog'])
  })

  it('ignores a removal for an account it has not seen', async () => {
    const index = createMemoryRepositoryIndex()

    await index.apply({ kind: 'remove', login: 'raferdev', repositories: ['notes.blog'] })
    expect(await index.listRepositories('raferdev')).toBeNull()
  })

  it('forgets an account entirely so lookups fall through again', async () => {
    const index = createMemoryRepositoryIndex({ raferdev: ['notes.blog'] })

    await index.apply({ kind: 'forget', login: 'raferdev' })
    expect(await index.listRepositories('raferdev')).toBeNull()
  })

  it('treats logins case-insensitively, as GitHub does', async () => {
    const index = createMemoryRepositoryIndex()

    await index.apply({ kind: 'set', login: 'RaferDev', repositories: ['notes.blog'] })
    expect(await index.listRepositories('raferdev')).toEqual(['notes.blog'])
  })
})

describe('createIndexedLister', () => {
  const fallback = { listRepositories: async () => ['from-api.blog'] }

  it('answers from the index when it knows the account', async () => {
    const index = createMemoryRepositoryIndex({ raferdev: ['from-index.blog'] })

    expect(await createIndexedLister(index, fallback).listRepositories('raferdev')).toEqual(['from-index.blog'])
  })

  it('falls back to the api when the index has never seen the account', async () => {
    const index = createMemoryRepositoryIndex()

    expect(await createIndexedLister(index, fallback).listRepositories('raferdev')).toEqual(['from-api.blog'])
  })

  it('trusts an indexed empty list rather than asking the api again', async () => {
    const index = createMemoryRepositoryIndex({ raferdev: [] })

    expect(await createIndexedLister(index, fallback).listRepositories('raferdev')).toEqual([])
  })
})
