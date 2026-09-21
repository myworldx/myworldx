import { createMemoryRepositoryIndex } from './memory-store'

export * from './store'
export * from './memory-store'

export const repositoryIndex = createMemoryRepositoryIndex()
