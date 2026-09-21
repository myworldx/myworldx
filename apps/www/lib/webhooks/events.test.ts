import { describe, expect, it } from 'vitest'

import { planIndexUpdate } from './events'

const account = { login: 'raferdev' }

function installation(action: string, repositories: string[]) {
  return {
    action,
    installation: { account },
    repositories: repositories.map((name) => ({ name })),
  }
}

describe('planIndexUpdate for installation events', () => {
  it('replaces the whole list when an installation is created', () => {
    expect(planIndexUpdate('installation', installation('created', ['notes.blog', 'dotfiles']))).toEqual([
      { kind: 'set', login: 'raferdev', repositories: ['notes.blog', 'dotfiles'] },
    ])
  })

  it('replaces the list again when an installation is unsuspended', () => {
    expect(planIndexUpdate('installation', installation('unsuspend', ['notes.blog']))).toEqual([
      { kind: 'set', login: 'raferdev', repositories: ['notes.blog'] },
    ])
  })

  it('forgets the account when the installation goes away or is suspended', () => {
    for (const action of ['deleted', 'suspend']) {
      expect(planIndexUpdate('installation', installation(action, [])), action).toEqual([
        { kind: 'forget', login: 'raferdev' },
      ])
    }
  })

  it('sets an empty list when an installation grants access to nothing', () => {
    expect(planIndexUpdate('installation', { action: 'created', installation: { account } })).toEqual([
      { kind: 'set', login: 'raferdev', repositories: [] },
    ])
  })

  it('ignores actions it has no opinion about', () => {
    expect(planIndexUpdate('installation', installation('new_permissions_accepted', ['x']))).toEqual([])
  })
})

describe('planIndexUpdate for installation_repositories events', () => {
  it('adds and removes in one event when both are present', () => {
    const operations = planIndexUpdate('installation_repositories', {
      action: 'added',
      installation: { account },
      repositories_added: [{ name: 'notes.blog' }],
      repositories_removed: [{ name: 'old.post' }],
    })

    expect(operations).toEqual([
      { kind: 'add', login: 'raferdev', repositories: ['notes.blog'] },
      { kind: 'remove', login: 'raferdev', repositories: ['old.post'] },
    ])
  })

  it('emits nothing when neither list has entries', () => {
    expect(
      planIndexUpdate('installation_repositories', {
        action: 'added',
        installation: { account },
        repositories_added: [],
        repositories_removed: [],
      })
    ).toEqual([])
  })
})

describe('planIndexUpdate for repository events', () => {
  const repository = { name: 'notes.blog', owner: account }

  it('adds a repository that becomes visible', () => {
    for (const action of ['created', 'publicized', 'unarchived', 'transferred']) {
      expect(planIndexUpdate('repository', { action, repository, installation: { account } }), action).toEqual([
        { kind: 'add', login: 'raferdev', repositories: ['notes.blog'] },
      ])
    }
  })

  it('removes a repository that stops being visible', () => {
    for (const action of ['deleted', 'privatized', 'archived']) {
      expect(planIndexUpdate('repository', { action, repository, installation: { account } }), action).toEqual([
        { kind: 'remove', login: 'raferdev', repositories: ['notes.blog'] },
      ])
    }
  })

  it('drops the old name and adds the new one on a rename', () => {
    expect(
      planIndexUpdate('repository', {
        action: 'renamed',
        repository,
        installation: { account },
        changes: { repository: { name: { from: 'scratch.blog' } } },
      })
    ).toEqual([
      { kind: 'remove', login: 'raferdev', repositories: ['scratch.blog'] },
      { kind: 'add', login: 'raferdev', repositories: ['notes.blog'] },
    ])
  })

  it('does not remove anything when a rename reports no previous name', () => {
    expect(planIndexUpdate('repository', { action: 'renamed', repository, installation: { account } })).toEqual([
      { kind: 'add', login: 'raferdev', repositories: ['notes.blog'] },
    ])
  })

  it('falls back to the repository owner when there is no installation', () => {
    expect(planIndexUpdate('repository', { action: 'created', repository })).toEqual([
      { kind: 'add', login: 'raferdev', repositories: ['notes.blog'] },
    ])
  })
})

describe('planIndexUpdate rejections', () => {
  it('emits nothing for an event it does not handle', () => {
    expect(planIndexUpdate('push', { installation: { account } })).toEqual([])
    expect(planIndexUpdate('ping', { installation: { account } })).toEqual([])
  })

  it('emits nothing when the account cannot be identified', () => {
    expect(planIndexUpdate('installation', { action: 'created', repositories: [] })).toEqual([])
  })

  it('survives a payload that is not shaped like an event', () => {
    expect(planIndexUpdate('installation', null)).toEqual([])
    expect(planIndexUpdate('installation', 'nonsense')).toEqual([])
    expect(planIndexUpdate('repository', { action: 'created', installation: { account } })).toEqual([])
  })

  it('discards list entries that carry no usable name', () => {
    expect(
      planIndexUpdate('installation', {
        action: 'created',
        installation: { account },
        repositories: [{ name: 'notes.blog' }, { name: 42 }, {}, null, { name: '' }],
      })
    ).toEqual([{ kind: 'set', login: 'raferdev', repositories: ['notes.blog'] }])
  })
})
