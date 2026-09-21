export const ORDERING_STRATEGIES = ['prefix', 'alphabetical', 'timestamp'] as const
export type Ordering = (typeof ORDERING_STRATEGIES)[number]
export type Direction = 'asc' | 'desc'

export type FolderConfig = {
  title?: string
  depth?: number
  ordering?: Ordering
  direction?: Direction
  hidden?: boolean
}

export type ContentNode = {
  slug: string[]
  href: string
  title: string
  order: number | null
  date: string | null
  isFolder: boolean
  children: ContentNode[]
}

export type ContentDoc = {
  slug: string[]
  href: string
  title: string
  description: string | null
  date: string | null
  body: string
}

export type Heading = { id: string; title: string; depth: 2 | 3 }

export const PAGE_EXTENSIONS = ['.mdx', '.md']
export const INDEX_BASENAMES = ['index', 'README']
export const CONFIG_BASENAMES = ['config.yml', 'config.yaml']

const PREFIX_PATTERN = /^(\d+)[-_.]/

export function stripPrefix(name: string): { order: number | null; rest: string } {
  const match = PREFIX_PATTERN.exec(name)
  if (!match) return { order: null, rest: name }
  return { order: Number(match[1]), rest: name.slice(match[0].length) }
}

export function stripExtension(name: string): string {
  const ext = PAGE_EXTENSIONS.find((e) => name.toLowerCase().endsWith(e))
  return ext ? name.slice(0, -ext.length) : name
}

export function titleFromSlug(segment: string): string {
  return segment
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function isPageFile(name: string): boolean {
  return PAGE_EXTENSIONS.some((e) => name.toLowerCase().endsWith(e))
}

export function isIndexFile(name: string): boolean {
  return INDEX_BASENAMES.includes(stripExtension(stripPrefix(name).rest))
}

export function isHiddenEntry(name: string): boolean {
  return name.startsWith('.') || name.startsWith('_')
}

export function defaultDirection(ordering: Ordering): Direction {
  return ordering === 'timestamp' ? 'desc' : 'asc'
}

export function normalizeDate(value: unknown): string | null {
  if (!value) return null
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}

function compare(a: ContentNode, b: ContentNode, ordering: Ordering): number {
  if (ordering === 'timestamp') {
    if (a.date && b.date) return a.date.localeCompare(b.date)
    if (a.date) return -1
    if (b.date) return 1
    return a.title.localeCompare(b.title)
  }

  if (ordering === 'prefix') {
    if (a.order !== null && b.order !== null) return a.order - b.order
    if (a.order !== null) return -1
    if (b.order !== null) return 1
  }

  return a.title.localeCompare(b.title, undefined, { numeric: true })
}

export function sortNodes(nodes: ContentNode[], ordering: Ordering, direction: Direction): ContentNode[] {
  const sorted = [...nodes].sort((a, b) => compare(a, b, ordering))
  return direction === 'desc' ? sorted.reverse() : sorted
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function extractHeadings(body: string): Heading[] {
  const withoutCode = body.replace(/```[\s\S]*?```/g, '')
  const headings: Heading[] = []

  for (const line of withoutCode.split('\n')) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!match?.[1] || !match[2]) continue

    const title = match[2].replace(/[*_`]/g, '')
    headings.push({
      id: slugifyHeading(title),
      title,
      depth: match[1].length === 2 ? 2 : 3,
    })
  }

  return headings
}
