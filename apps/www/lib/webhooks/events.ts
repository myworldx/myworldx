export type IndexOperation =
  | { kind: 'set'; login: string; repositories: string[] }
  | { kind: 'add'; login: string; repositories: string[] }
  | { kind: 'remove'; login: string; repositories: string[] }
  | { kind: 'forget'; login: string }

type Named = { name?: unknown }

function readLogin(payload: Record<string, unknown>): string | null {
  const installation = payload.installation as { account?: { login?: unknown } } | undefined
  const fromInstallation = installation?.account?.login

  if (typeof fromInstallation === 'string' && fromInstallation) return fromInstallation

  const repository = payload.repository as { owner?: { login?: unknown } } | undefined
  const fromRepository = repository?.owner?.login

  return typeof fromRepository === 'string' && fromRepository ? fromRepository : null
}

function readNames(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((entry) => (entry as Named)?.name)
    .filter((name): name is string => typeof name === 'string' && name.length > 0)
}

function readRepositoryName(payload: Record<string, unknown>): string | null {
  const repository = payload.repository as Named | undefined
  const name = repository?.name

  return typeof name === 'string' && name ? name : null
}

export function planIndexUpdate(event: string, payload: unknown): IndexOperation[] {
  if (!payload || typeof payload !== 'object') return []

  const body = payload as Record<string, unknown>
  const action = typeof body.action === 'string' ? body.action : null
  const login = readLogin(body)
  if (!login) return []

  if (event === 'installation') {
    if (action === 'created' || action === 'unsuspend') {
      return [{ kind: 'set', login, repositories: readNames(body.repositories) }]
    }

    if (action === 'deleted' || action === 'suspend') {
      return [{ kind: 'forget', login }]
    }

    return []
  }

  if (event === 'installation_repositories') {
    const operations: IndexOperation[] = []
    const added = readNames(body.repositories_added)
    const removed = readNames(body.repositories_removed)

    if (added.length) operations.push({ kind: 'add', login, repositories: added })
    if (removed.length) operations.push({ kind: 'remove', login, repositories: removed })

    return operations
  }

  if (event === 'repository') {
    const name = readRepositoryName(body)
    if (!name) return []

    if (action === 'created' || action === 'publicized' || action === 'unarchived') {
      return [{ kind: 'add', login, repositories: [name] }]
    }

    if (action === 'deleted' || action === 'privatized' || action === 'archived') {
      return [{ kind: 'remove', login, repositories: [name] }]
    }

    if (action === 'renamed') {
      const changes = body.changes as { repository?: { name?: { from?: unknown } } } | undefined
      const previous = changes?.repository?.name?.from

      const operations: IndexOperation[] = []
      if (typeof previous === 'string' && previous && previous !== name) {
        operations.push({ kind: 'remove', login, repositories: [previous] })
      }
      operations.push({ kind: 'add', login, repositories: [name] })

      return operations
    }

    if (action === 'transferred') {
      return [{ kind: 'add', login, repositories: [name] }]
    }

    return []
  }

  return []
}

export function affectedLogins(operations: readonly IndexOperation[]): string[] {
  return [...new Set(operations.map((operation) => operation.login.toLowerCase()))]
}
