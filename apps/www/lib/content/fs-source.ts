import fs from 'node:fs'
import path from 'node:path'

import type { ContentEntry, ContentSource } from './source'

export function locateContentRoot(directory: string): string {
  let dir = process.cwd()

  for (let depth = 0; depth < 8; depth += 1) {
    const candidate = path.join(dir, directory)
    if (fs.existsSync(candidate)) return candidate

    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  return path.join(process.cwd(), directory)
}

export function createFsSource(root: string): ContentSource {
  const resolve = (segments: string[]) => path.join(root, ...segments)

  return {
    async readDir(segments) {
      const dir = resolve(segments)
      if (!fs.existsSync(dir)) return []

      return fs.readdirSync(dir, { withFileTypes: true }).map((entry): ContentEntry => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
      }))
    },

    async readFile(segments) {
      const file = resolve(segments)
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null

      return fs.readFileSync(file, 'utf8')
    },
  }
}
