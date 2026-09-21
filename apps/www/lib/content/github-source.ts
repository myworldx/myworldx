import type { ContentEntry, ContentSource } from './source'

export type GitHubTreeEntry = {
  path: string
  type: 'blob' | 'tree'
}

export type GitHubTree = {
  entries: GitHubTreeEntry[]
  truncated: boolean
}

export interface GitHubClient {
  fetchTree(): Promise<GitHubTree>
  fetchBlob(path: string): Promise<string | null>
}

export class GitHubTreeTruncatedError extends Error {
  constructor(repository: string) {
    super(
      `The git tree for ${repository} came back truncated. It holds more entries than the trees API returns in one response, so the page tree would be silently incomplete.`
    )
    this.name = 'GitHubTreeTruncatedError'
  }
}

export function createGitHubSource(client: GitHubClient): ContentSource {
  let pending: Promise<Map<string, ContentEntry[]>> | null = null

  function index(tree: GitHubTree): Map<string, ContentEntry[]> {
    const directories = new Map<string, ContentEntry[]>([['', []]])

    const ensure = (key: string): ContentEntry[] => {
      const existing = directories.get(key)
      if (existing) return existing

      const created: ContentEntry[] = []
      directories.set(key, created)
      return created
    }

    for (const entry of tree.entries) {
      const separator = entry.path.lastIndexOf('/')
      const parent = separator === -1 ? '' : entry.path.slice(0, separator)
      const name = separator === -1 ? entry.path : entry.path.slice(separator + 1)

      if (entry.type === 'tree') ensure(entry.path)
      ensure(parent).push({ name, isDirectory: entry.type === 'tree' })
    }

    return directories
  }

  async function directories(): Promise<Map<string, ContentEntry[]>> {
    pending ??= client.fetchTree().then(index)

    try {
      return await pending
    } catch (error) {
      pending = null
      throw error
    }
  }

  return {
    async readDir(segments) {
      return (await directories()).get(segments.join('/')) ?? []
    },

    async readFile(segments) {
      const path = segments.join('/')
      const parent = segments.slice(0, -1)
      const name = segments.at(-1)

      const siblings = await this.readDir(parent)
      const match = siblings.find((entry) => entry.name === name && !entry.isDirectory)
      if (!match) return null

      return client.fetchBlob(path)
    },
  }
}

const API = 'https://api.github.com'

export type RestClientOptions = {
  owner: string
  repository: string
  ref: string
  token?: string
  revalidate?: number
}

export function createRestClient({ owner, repository, ref, token, revalidate = 300 }: RestClientOptions): GitHubClient {
  const slug = `${owner}/${repository}`

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const request = async (url: string, accept?: string) => {
    const response = await fetch(url, {
      headers: accept ? { ...headers, Accept: accept } : headers,
      next: { revalidate },
    })

    return response
  }

  return {
    async fetchTree() {
      const response = await request(`${API}/repos/${slug}/git/trees/${encodeURIComponent(ref)}?recursive=1`)

      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status} for the git tree of ${slug} at ${ref}.`)
      }

      const body = (await response.json()) as {
        tree?: Array<{ path: string; type: string }>
        truncated?: boolean
      }

      if (body.truncated) throw new GitHubTreeTruncatedError(slug)

      const entries = (body.tree ?? [])
        .filter((entry) => entry.type === 'blob' || entry.type === 'tree')
        .map((entry): GitHubTreeEntry => ({ path: entry.path, type: entry.type as 'blob' | 'tree' }))

      return { entries, truncated: false }
    },

    async fetchBlob(path) {
      const url = `${API}/repos/${slug}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(ref)}`
      const response = await request(url, 'application/vnd.github.raw')

      if (response.status === 404) return null
      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status} for ${path} in ${slug} at ${ref}.`)
      }

      return response.text()
    },
  }
}
