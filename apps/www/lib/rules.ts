import type { Direction, Ordering } from '@/lib/content'

export const NODE_TYPES = ['index', 'blog', 'post', 'project'] as const

export type NodeType = (typeof NODE_TYPES)[number]

export type NodeTypeDefinition = {
  type: NodeType
  title: string
  description: string
  ordering: Ordering
  direction: Direction
}

export const NODE_TYPE_DEFINITIONS: Record<NodeType, NodeTypeDefinition> = {
  index: {
    type: 'index',
    title: 'Index',
    description: 'The root of an account, linking out to everything else it publishes',
    ordering: 'prefix',
    direction: 'asc',
  },
  blog: {
    type: 'blog',
    title: 'Blog',
    description: 'Dated entries, newest first',
    ordering: 'timestamp',
    direction: 'desc',
  },
  post: {
    type: 'post',
    title: 'Post',
    description: 'A single standalone page',
    ordering: 'prefix',
    direction: 'asc',
  },
  project: {
    type: 'project',
    title: 'Project',
    description: 'A project write-up, ordered the way its folders are numbered',
    ordering: 'prefix',
    direction: 'asc',
  },
}

export type RepositoryNode = {
  repository: string
  slug: string
  type: NodeType
  definition: NodeTypeDefinition
}

function isNodeType(value: string): value is NodeType {
  return (NODE_TYPES as readonly string[]).includes(value)
}

export function parseRepositoryName(repository: string): RepositoryNode | null {
  const separator = repository.lastIndexOf('.')
  if (separator <= 0 || separator === repository.length - 1) return null

  const extension = repository.slice(separator + 1).toLowerCase()
  if (!isNodeType(extension)) return null

  const slug = repository.slice(0, separator)
  if (!slug) return null

  return {
    repository,
    slug,
    type: extension,
    definition: NODE_TYPE_DEFINITIONS[extension],
  }
}

export function selectContentRepositories(repositories: readonly string[]): RepositoryNode[] {
  return repositories.map(parseRepositoryName).filter((node): node is RepositoryNode => node !== null)
}
