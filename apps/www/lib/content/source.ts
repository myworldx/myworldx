export type ContentEntry = {
  name: string
  isDirectory: boolean
}

export interface ContentSource {
  readDir(path: string[]): Promise<ContentEntry[]>
  readFile(path: string[]): Promise<string | null>
}
