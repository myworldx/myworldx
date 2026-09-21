import { describe, expect, it } from 'vitest'

import { createGitHubSource, type GitHubClient, type GitHubTreeEntry } from './github-source'
import { createContent } from './index'
import { createMemorySource } from './memory-source'
import type { ContentSource } from './source'

function doc(title: string, extra = '') {
  return `---\ntitle: ${title}\n${extra}---\n\nBody of ${title}.\n`
}

const files: Record<string, string> = {
  'config.yml': 'title: Origin\nordering: prefix\ndepth: 3\n',
  'index.mdx': doc('Home'),

  '01-guides/config.yml': 'title: Guides\nordering: prefix\n',
  '01-guides/index.mdx': doc('Guides'),
  '01-guides/02-second.mdx': doc('Second'),
  '01-guides/01-first.mdx': doc('First'),

  '02-blog/config.yml': 'title: Blog\nordering: timestamp\ndirection: desc\n',
  '02-blog/older.mdx': doc('Older', 'date: 2024-01-01\n'),
  '02-blog/newer.mdx': doc('Newer', 'date: 2025-06-01\n'),
  '02-blog/nested/index.mdx': doc('Nested'),
  '02-blog/nested/leaf.mdx': doc('Leaf'),

  '03-draft/config.yml': 'hidden: true\n',
  '03-draft/secret.mdx': doc('Secret'),

  '_private/notes.mdx': doc('Private'),
  '.hidden/notes.mdx': doc('Dotted'),
}

function createFakeGitHubClient(contents: Record<string, string>): GitHubClient {
  const entries: GitHubTreeEntry[] = []
  const directories = new Set<string>()

  for (const path of Object.keys(contents)) {
    const parts = path.split('/')

    for (let depth = 1; depth < parts.length; depth += 1) {
      const directory = parts.slice(0, depth).join('/')
      if (directories.has(directory)) continue

      directories.add(directory)
      entries.push({ path: directory, type: 'tree' })
    }

    entries.push({ path, type: 'blob' })
  }

  return {
    async fetchTree() {
      return { entries, truncated: false }
    },
    async fetchBlob(path) {
      return contents[path] ?? null
    },
  }
}

const adapters: Array<[string, (contents: Record<string, string>) => ContentSource]> = [
  ['memory', createMemorySource],
  ['github', (contents) => createGitHubSource(createFakeGitHubClient(contents))],
]

describe.each(adapters)('createContent over the %s source', (_name, createSource) => {
  const content = createContent(createSource(files))

  it('orders by numeric prefix and strips it from the slug', async () => {
    const tree = await content.getContentTree()
    expect(tree.map((n) => n.href)).toEqual(['/guides', '/blog'])

    const guides = tree.find((n) => n.href === '/guides')
    expect(guides?.children.map((n) => n.href)).toEqual(['/guides/first', '/guides/second'])
  })

  it('orders dated pages newest first in a timestamp folder', async () => {
    const tree = await content.getContentTree()
    const blog = tree.find((n) => n.href === '/blog')
    const dated = blog?.children.filter((n) => n.date).map((n) => n.title)
    expect(dated).toEqual(['Newer', 'Older'])
  })

  it('floats undated entries above dated ones when a timestamp folder is descending', async () => {
    const tree = await content.getContentTree()
    const blog = tree.find((n) => n.href === '/blog')
    expect(blog?.children.map((n) => n.title)).toEqual(['Nested', 'Newer', 'Older'])
  })

  it('takes folder titles from config.yml and page titles from frontmatter', async () => {
    const tree = await content.getContentTree()
    expect(tree.find((n) => n.href === '/guides')?.title).toBe('Guides')
    expect(tree.find((n) => n.href === '/blog')?.children.find((n) => n.href === '/blog/newer')?.title).toBe('Newer')
  })

  it('omits hidden folders and entries prefixed with a dot or underscore', async () => {
    const tree = await content.getContentTree()
    const hrefs = tree.map((n) => n.href)
    expect(hrefs).not.toContain('/draft')
    expect(hrefs).not.toContain('/_private')
    expect(hrefs).not.toContain('/.hidden')
  })

  it('does not list index files as their own pages', async () => {
    const tree = await content.getContentTree()
    const guides = tree.find((n) => n.href === '/guides')
    expect(guides?.children.map((n) => n.href)).not.toContain('/guides/index')
  })

  it('resolves a folder to its index file', async () => {
    expect((await content.getDoc([]))?.title).toBe('Home')
    expect((await content.getDoc(['guides']))?.title).toBe('Guides')
    expect((await content.getDoc(['blog', 'nested']))?.title).toBe('Nested')
  })

  it('resolves a prefixed page from its unprefixed slug', async () => {
    const first = await content.getDoc(['guides', 'first'])
    expect(first?.title).toBe('First')
    expect(first?.href).toBe('/guides/first')
  })

  it('returns null for a path that does not resolve', async () => {
    expect(await content.getDoc(['nope'])).toBeNull()
    expect(await content.getDoc(['guides', 'nope', 'deeper'])).toBeNull()
  })

  it('separates frontmatter from the body', async () => {
    const home = await content.getDoc([])
    expect(home?.body.trim()).toBe('Body of Home.')
    expect(home?.body).not.toContain('title:')
  })

  it('enumerates every routable slug including the root', async () => {
    const slugs = (await content.getAllDocSlugs()).map((s) => '/' + s.join('/'))
    expect(slugs).toContain('/')
    expect(slugs).toContain('/guides')
    expect(slugs).toContain('/guides/first')
    expect(slugs).toContain('/blog/nested')
    expect(slugs).toContain('/blog/nested/leaf')
    expect(slugs).not.toContain('/draft/secret')
  })

  it('reads the visible depth from the root config', async () => {
    expect(await content.getVisibleDepth()).toBe(3)
    const bare = createContent(createSource({ 'index.mdx': doc('Only') }))
    expect(await bare.getVisibleDepth()).toBe(3)
  })

  it('yields an empty tree for an empty source', async () => {
    const empty = createContent(createSource({}))
    expect(await empty.getContentTree()).toEqual([])
    expect(await empty.getAllDocSlugs()).toEqual([])
    expect(await empty.getDoc([])).toBeNull()
  })
})
