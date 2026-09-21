import { describe, expect, it } from 'vitest'

import { NODE_TYPE_DEFINITIONS, parseRepositoryName, selectContentRepositories } from './rules'

describe('parseRepositoryName', () => {
  it('reads the node type from the extension', () => {
    expect(parseRepositoryName('notes.blog')).toMatchObject({ slug: 'notes', type: 'blog' })
    expect(parseRepositoryName('me.index')).toMatchObject({ slug: 'me', type: 'index' })
    expect(parseRepositoryName('sidegig.project')).toMatchObject({ slug: 'sidegig', type: 'project' })
    expect(parseRepositoryName('thought.post')).toMatchObject({ slug: 'thought', type: 'post' })
  })

  it('carries the definition for the type it matched', () => {
    expect(parseRepositoryName('notes.blog')?.definition).toBe(NODE_TYPE_DEFINITIONS.blog)
    expect(parseRepositoryName('notes.blog')?.definition.ordering).toBe('timestamp')
    expect(parseRepositoryName('notes.blog')?.definition.direction).toBe('desc')
  })

  it('takes only the final segment as the extension', () => {
    expect(parseRepositoryName('my.old.notes.blog')).toMatchObject({ slug: 'my.old.notes', type: 'blog' })
  })

  it('matches the extension regardless of case', () => {
    expect(parseRepositoryName('notes.BLOG')).toMatchObject({ slug: 'notes', type: 'blog' })
  })

  it('rejects a repository with no extension', () => {
    expect(parseRepositoryName('myworldx')).toBeNull()
  })

  it('rejects an extension that is not a known node type', () => {
    expect(parseRepositoryName('notes.wiki')).toBeNull()
    expect(parseRepositoryName('site.com')).toBeNull()
  })

  it('rejects a name that is only an extension or only a dot', () => {
    expect(parseRepositoryName('.blog')).toBeNull()
    expect(parseRepositoryName('notes.')).toBeNull()
    expect(parseRepositoryName('.')).toBeNull()
    expect(parseRepositoryName('')).toBeNull()
  })
})

describe('selectContentRepositories', () => {
  it('keeps the repositories that name a node type and drops the rest', () => {
    const selected = selectContentRepositories([
      'notes.blog',
      'dotfiles',
      'me.index',
      'scratch.wiki',
      'sidegig.project',
    ])

    expect(selected.map((node) => node.repository)).toEqual(['notes.blog', 'me.index', 'sidegig.project'])
  })

  it('returns nothing when an account publishes no content repositories', () => {
    expect(selectContentRepositories(['dotfiles', 'infra'])).toEqual([])
  })
})
