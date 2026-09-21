import type { ContentEntry, ContentSource } from './source'

export function createMemorySource(files: Record<string, string>): ContentSource {
  const paths = Object.keys(files)

  return {
    async readDir(segments) {
      const prefix = segments.length === 0 ? '' : segments.join('/') + '/'
      const seen = new Map<string, ContentEntry>()

      for (const filePath of paths) {
        if (!filePath.startsWith(prefix)) continue

        const rest = filePath.slice(prefix.length)
        if (rest.length === 0) continue

        const slash = rest.indexOf('/')
        const name = slash === -1 ? rest : rest.slice(0, slash)
        if (!seen.has(name)) seen.set(name, { name, isDirectory: slash !== -1 })
      }

      return [...seen.values()]
    },

    async readFile(segments) {
      return files[segments.join('/')] ?? null
    },
  }
}
