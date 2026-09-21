import type { RepositoryIndex } from './store'

export function createMemoryRepositoryIndex(initial: Record<string, string[]> = {}): RepositoryIndex {
  const accounts = new Map<string, Set<string>>(
    Object.entries(initial).map(([login, repositories]) => [login.toLowerCase(), new Set(repositories)])
  )

  return {
    async listRepositories(login) {
      const known = accounts.get(login.toLowerCase())
      return known ? [...known].sort() : null
    },

    async apply(operation) {
      const key = operation.login.toLowerCase()

      if (operation.kind === 'forget') {
        accounts.delete(key)
        return
      }

      if (operation.kind === 'set') {
        accounts.set(key, new Set(operation.repositories))
        return
      }

      const known = accounts.get(key)

      if (operation.kind === 'add') {
        const next = known ?? new Set<string>()
        for (const repository of operation.repositories) next.add(repository)
        accounts.set(key, next)
        return
      }

      if (!known) return
      for (const repository of operation.repositories) known.delete(repository)
    },
  }
}
