import {
  createAccountSource,
  createContent,
  createGitHubSource,
  createRestClient,
  titleFromSlug,
  type AccountMount,
  type Content,
} from '@/lib/content'
import { selectContentRepositories, type RepositoryNode } from '@/lib/rules'

const API = 'https://api.github.com'

export type Account = {
  login: string
  nodes: RepositoryNode[]
  content: Content
}

export interface RepositoryLister {
  listRepositories(login: string): Promise<string[] | null>
}

export function createRestRepositoryLister(token?: string, revalidate = 300): RepositoryLister {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (token) headers.Authorization = `Bearer ${token}`

  return {
    async listRepositories(login) {
      const response = await fetch(`${API}/users/${encodeURIComponent(login)}/repos?per_page=100&sort=full_name`, {
        headers,
        next: { revalidate },
      })

      if (response.status === 404) return null
      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status} listing repositories for ${login}.`)
      }

      const body = (await response.json()) as Array<{ name?: string }>
      return body.map((repository) => repository.name).filter((name): name is string => typeof name === 'string')
    },
  }
}

function synthesizeAccountIndex(login: string, mounts: readonly AccountMount[]): string {
  const sections = mounts.map((mount) => `- [${mount.title}](/${mount.slug})`).join('\n')

  return [
    '---',
    `title: ${JSON.stringify(login)}`,
    'description: "Published from GitHub repositories."',
    '---',
    '',
    sections,
    '',
  ].join('\n')
}

export type AccountOptions = {
  lister: RepositoryLister
  createSource: (login: string, repository: string) => ReturnType<typeof createGitHubSource>
}

export function createAccountLoader({ lister, createSource }: AccountOptions) {
  return async function loadAccount(login: string): Promise<Account | null> {
    const repositories = await lister.listRepositories(login)
    if (repositories === null) return null

    const nodes = selectContentRepositories(repositories)
    if (nodes.length === 0) return null

    const indexNode = nodes.find((node) => node.type === 'index')
    const sections = nodes.filter((node) => node !== indexNode)

    const mounts: AccountMount[] = sections.map((node) => ({
      slug: node.slug,
      title: titleFromSlug(node.slug),
      ordering: node.definition.ordering,
      direction: node.definition.direction,
      source: createSource(login, node.repository),
    }))

    const root = indexNode ? createSource(login, indexNode.repository) : undefined

    const content = createContent(
      createAccountSource({
        mounts,
        root,
        rootIndex: root ? undefined : synthesizeAccountIndex(login, mounts),
      })
    )

    return { login, nodes, content }
  }
}

export const loadAccount = createAccountLoader({
  lister: createRestRepositoryLister(process.env.GITHUB_TOKEN),
  createSource: (login, repository) =>
    createGitHubSource(
      createRestClient({
        owner: login,
        repository,
        ref: 'HEAD',
        token: process.env.GITHUB_TOKEN,
      })
    ),
})
