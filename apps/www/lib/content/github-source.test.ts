import { describe, expect, it, vi } from 'vitest'

import { createGitHubSource, GitHubTreeTruncatedError, type GitHubClient, type GitHubTree } from './github-source'

const tree: GitHubTree = {
  truncated: false,
  entries: [
    { path: 'README.md', type: 'blob' },
    { path: 'docs', type: 'tree' },
    { path: 'docs/index.mdx', type: 'blob' },
    { path: 'docs/deep', type: 'tree' },
    { path: 'docs/deep/leaf.mdx', type: 'blob' },
    { path: 'empty', type: 'tree' },
  ],
}

function client(overrides: Partial<GitHubClient> = {}): GitHubClient {
  return {
    async fetchTree() {
      return tree
    },
    async fetchBlob(path) {
      return path === 'docs/index.mdx' ? '# Docs' : null
    },
    ...overrides,
  }
}

describe('createGitHubSource', () => {
  it('derives directory listings from a flat recursive tree', async () => {
    const source = createGitHubSource(client())

    expect(await source.readDir([])).toEqual([
      { name: 'README.md', isDirectory: false },
      { name: 'docs', isDirectory: true },
      { name: 'empty', isDirectory: true },
    ])

    expect(await source.readDir(['docs'])).toEqual([
      { name: 'index.mdx', isDirectory: false },
      { name: 'deep', isDirectory: true },
    ])

    expect(await source.readDir(['docs', 'deep'])).toEqual([{ name: 'leaf.mdx', isDirectory: false }])
  })

  it('reports a directory that exists but holds nothing', async () => {
    expect(await createGitHubSource(client()).readDir(['empty'])).toEqual([])
  })

  it('reports an unknown directory as empty rather than throwing', async () => {
    expect(await createGitHubSource(client()).readDir(['nope', 'deeper'])).toEqual([])
  })

  it('fetches the tree once however many reads follow', async () => {
    const fetchTree = vi.fn(async () => tree)
    const source = createGitHubSource(client({ fetchTree }))

    await Promise.all([source.readDir([]), source.readDir(['docs']), source.readFile(['docs', 'index.mdx'])])
    await source.readDir(['docs', 'deep'])

    expect(fetchTree).toHaveBeenCalledTimes(1)
  })

  it('retries the tree on a later read when the first fetch failed', async () => {
    let attempt = 0
    const fetchTree = vi.fn(async () => {
      attempt += 1
      if (attempt === 1) throw new Error('network')
      return tree
    })

    const source = createGitHubSource(client({ fetchTree }))

    await expect(source.readDir([])).rejects.toThrow('network')
    expect(await source.readDir(['docs'])).toHaveLength(2)
    expect(fetchTree).toHaveBeenCalledTimes(2)
  })

  it('does not request a blob for a path the tree does not list', async () => {
    const fetchBlob = vi.fn(async () => 'never')
    const source = createGitHubSource(client({ fetchBlob }))

    expect(await source.readFile(['docs', 'missing.mdx'])).toBeNull()
    expect(fetchBlob).not.toHaveBeenCalled()
  })

  it('does not treat a directory as a readable file', async () => {
    const fetchBlob = vi.fn(async () => 'never')
    const source = createGitHubSource(client({ fetchBlob }))

    expect(await source.readFile(['docs'])).toBeNull()
    expect(fetchBlob).not.toHaveBeenCalled()
  })

  it('returns blob contents for a listed file', async () => {
    expect(await createGitHubSource(client()).readFile(['docs', 'index.mdx'])).toBe('# Docs')
  })

  it('refuses a truncated tree instead of serving a partial page tree', async () => {
    const source = createGitHubSource(
      client({
        async fetchTree() {
          throw new GitHubTreeTruncatedError('owner/repo')
        },
      })
    )

    await expect(source.readDir([])).rejects.toThrow(GitHubTreeTruncatedError)
  })
})
