export type ContentEntry = {
  name: string
  isDirectory: boolean
}

export interface ContentSource {
  readDir(path: string[]): Promise<ContentEntry[]>
  readFile(path: string[]): Promise<string | null>
}

export function scopeSource(source: ContentSource, base: string[]): ContentSource {
  if (base.length === 0) return source

  return {
    readDir: (path) => source.readDir([...base, ...path]),
    readFile: (path) => source.readFile([...base, ...path]),
  }
}
