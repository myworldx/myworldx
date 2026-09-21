import type { ContentEntry, ContentSource } from './source'
import type { Direction, Ordering } from './tree'

export type AccountMount = {
  slug: string
  title: string
  ordering: Ordering
  direction: Direction
  source: ContentSource
}

export type AccountSourceOptions = {
  mounts: readonly AccountMount[]
  root?: ContentSource
  rootIndex?: string
}

function synthesizeConfig({ title, ordering, direction }: AccountMount): string {
  return `title: ${JSON.stringify(title)}\nordering: ${ordering}\ndirection: ${direction}\n`
}

export function createAccountSource({ mounts, root, rootIndex }: AccountSourceOptions): ContentSource {
  const bySlug = new Map(mounts.map((mount) => [mount.slug, mount]))

  const source: ContentSource = {
    async readDir(path) {
      if (path.length === 0) {
        const own = root ? await root.readDir([]) : []
        const kept = own.filter((entry) => !bySlug.has(entry.name))
        const sections = mounts.map((mount): ContentEntry => ({ name: mount.slug, isDirectory: true }))

        const hasIndex = kept.some((entry) => !entry.isDirectory && isIndexName(entry.name))
        const synthesized: ContentEntry[] =
          rootIndex !== undefined && !hasIndex ? [{ name: 'index.mdx', isDirectory: false }] : []

        return [...synthesized, ...kept, ...sections]
      }

      const [head, ...rest] = path
      const mount = head === undefined ? undefined : bySlug.get(head)
      if (mount) return mount.source.readDir(rest)

      return root ? root.readDir(path) : []
    },

    async readFile(path) {
      if (path.length === 0) return null

      const [head, ...rest] = path
      const mount = head === undefined ? undefined : bySlug.get(head)

      if (!mount) {
        const own = root ? await root.readFile(path) : null
        if (own !== null) return own

        if (path.length === 1 && rootIndex !== undefined && isIndexName(head)) return rootIndex

        return null
      }

      if (rest.length === 0) return null

      const own = await mount.source.readFile(rest)
      if (own !== null) return own

      if (rest.length === 1 && rest[0] === 'config.yml') {
        const alternate = await mount.source.readFile(['config.yaml'])
        return alternate ?? synthesizeConfig(mount)
      }

      return null
    },
  }

  return source
}

function isIndexName(name: string | undefined): boolean {
  return name === 'index.mdx'
}
