import { describe, expect, it } from 'vitest'

import { createAccountSource, type AccountMount } from './account-source'
import { createContent } from './index'
import { createMemorySource } from './memory-source'

function doc(title: string, extra = '') {
  return `---\ntitle: ${title}\n${extra}---\n\nBody of ${title}.\n`
}

function mount(slug: string, files: Record<string, string>, overrides: Partial<AccountMount> = {}): AccountMount {
  return {
    slug,
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    ordering: 'prefix',
    direction: 'asc',
    source: createMemorySource(files),
    ...overrides,
  }
}

const notes = mount(
  'notes',
  {
    'index.mdx': doc('Notes'),
    'older.mdx': doc('Older', 'date: 2024-01-01\n'),
    'newer.mdx': doc('Newer', 'date: 2025-06-01\n'),
  },
  { ordering: 'timestamp', direction: 'desc' }
)

const guides = mount('guides', {
  'index.mdx': doc('Guides'),
  '01-first.mdx': doc('First'),
  '02-second.mdx': doc('Second'),
})

describe('createAccountSource', () => {
  it('presents each repository as a top-level directory', async () => {
    const source = createAccountSource({ mounts: [notes, guides] })

    expect(await source.readDir([])).toEqual([
      { name: 'notes', isDirectory: true },
      { name: 'guides', isDirectory: true },
    ])
  })

  it('delegates reads beneath a mount to that repository', async () => {
    const source = createAccountSource({ mounts: [notes, guides] })

    expect((await source.readDir(['guides'])).map((entry) => entry.name)).toEqual([
      'index.mdx',
      '01-first.mdx',
      '02-second.mdx',
    ])
    expect(await source.readFile(['guides', '01-first.mdx'])).toContain('title: First')
  })

  it('reports an unmounted slug as empty rather than throwing', async () => {
    const source = createAccountSource({ mounts: [notes] })

    expect(await source.readDir(['nope'])).toEqual([])
    expect(await source.readFile(['nope', 'index.mdx'])).toBeNull()
  })

  it('has nothing to read at the account root itself', async () => {
    expect(await createAccountSource({ mounts: [notes] }).readFile([])).toBeNull()
    expect(await createAccountSource({ mounts: [notes] }).readFile(['notes'])).toBeNull()
  })

  it('synthesizes a config.yml from the node type when the repository ships none', async () => {
    const source = createAccountSource({ mounts: [notes] })
    const config = await source.readFile(['notes', 'config.yml'])

    expect(config).toContain('title: "Notes"')
    expect(config).toContain('ordering: timestamp')
    expect(config).toContain('direction: desc')
  })

  it('prefers a config the repository ships over the synthesized one', async () => {
    const source = createAccountSource({
      mounts: [
        mount('notes', { 'config.yml': 'title: Field notes\nordering: alphabetical\n', 'index.mdx': doc('Notes') }),
      ],
    })

    expect(await source.readFile(['notes', 'config.yml'])).toContain('Field notes')
  })

  it('finds a config the repository spells with the yaml extension', async () => {
    const source = createAccountSource({
      mounts: [mount('notes', { 'config.yaml': 'title: Yaml spelled\n', 'index.mdx': doc('Notes') })],
    })

    expect(await source.readFile(['notes', 'config.yml'])).toContain('Yaml spelled')
  })
})

describe('an account rendered through the content engine', () => {
  const content = createContent(createAccountSource({ mounts: [notes, guides] }))

  it('lists every repository as a section', async () => {
    const tree = await content.getContentTree()
    expect(tree.map((node) => node.href)).toEqual(['/guides', '/notes'])
  })

  it('titles each section from the synthesized config', async () => {
    const tree = await content.getContentTree()
    expect(tree.map((node) => node.title)).toEqual(['Guides', 'Notes'])
  })

  it('applies the ordering the node type asked for inside each repository', async () => {
    const tree = await content.getContentTree()

    expect(tree.find((n) => n.href === '/notes')?.children.map((n) => n.title)).toEqual(['Newer', 'Older'])
    expect(tree.find((n) => n.href === '/guides')?.children.map((n) => n.title)).toEqual(['First', 'Second'])
  })

  it('resolves pages and indexes across mounts', async () => {
    expect((await content.getDoc(['notes']))?.title).toBe('Notes')
    expect((await content.getDoc(['guides', 'first']))?.title).toBe('First')
    expect(await content.getDoc(['notes', 'nope'])).toBeNull()
  })

  it('enumerates the slugs of every mounted repository', async () => {
    const slugs = (await content.getAllDocSlugs()).map((s) => '/' + s.join('/'))

    expect(slugs).toContain('/notes')
    expect(slugs).toContain('/notes/newer')
    expect(slugs).toContain('/guides/second')
  })
})

describe('the account root', () => {
  const profile = createMemorySource({
    'index.mdx': doc('Rafael'),
    'about.mdx': doc('About'),
  })

  it('serves an index repository at the root rather than as a section', async () => {
    const content = createContent(createAccountSource({ mounts: [notes], root: profile }))

    expect((await content.getDoc([]))?.title).toBe('Rafael')
    expect((await content.getDoc(['about']))?.title).toBe('About')
    expect((await content.getContentTree()).map((n) => n.href)).toContain('/notes')
  })

  it('keeps a section reachable when the index repository names a file the same way', async () => {
    const collide = createMemorySource({ 'index.mdx': doc('Root'), 'notes.mdx': doc('Shadowed') })
    const source = createAccountSource({ mounts: [notes], root: collide })

    const names = (await source.readDir([])).map((entry) => entry.name)
    expect(names).toContain('notes')
    expect(names.filter((name) => name === 'notes')).toHaveLength(1)
  })

  it('synthesizes a landing page listing the sections when there is no index repository', async () => {
    const content = createContent(
      createAccountSource({
        mounts: [notes, guides],
        rootIndex: '---\ntitle: "raferdev"\n---\n\n- [Notes](/notes)\n- [Guides](/guides)\n',
      })
    )

    const root = await content.getDoc([])
    expect(root?.title).toBe('raferdev')
    expect(root?.body).toContain('[Notes](/notes)')
  })

  it('prefers a real index repository over the synthesized landing page', async () => {
    const content = createContent(
      createAccountSource({ mounts: [notes], root: profile, rootIndex: '---\ntitle: Synthetic\n---\n' })
    )

    expect((await content.getDoc([]))?.title).toBe('Rafael')
  })
})
