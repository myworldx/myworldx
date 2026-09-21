import type { IndexOperation } from '@/lib/webhooks/events'

export interface RepositoryIndex {
  listRepositories(login: string): Promise<string[] | null>
  apply(operation: IndexOperation): Promise<void>
}

export async function applyOperations(index: RepositoryIndex, operations: readonly IndexOperation[]): Promise<void> {
  for (const operation of operations) {
    await index.apply(operation)
  }
}
