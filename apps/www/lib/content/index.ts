import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'

import { createFsSource, locateContentRoot } from './fs-source'
import type { ContentSource } from './source'
import {
  CONFIG_BASENAMES,
  defaultDirection,
  isHiddenEntry,
  isIndexFile,
  isPageFile,
  normalizeDate,
  sortNodes,
  stripExtension,
  stripPrefix,
  titleFromSlug,
  type ContentDoc,
  type ContentNode,
  type FolderConfig,
  type Ordering,
} from './tree'

export * from './tree'
export * from './source'
export { createFsSource, locateContentRoot }

const MATTER_OPTIONS = { engines: { yaml: (raw: string) => parseYaml(raw) } }

const DEFAULT_VISIBLE_DEPTH = 3
const DEFAULT_ORDERING: Ordering = 'prefix'

type Frontmatter = { title?: string; date?: unknown; description?: string }

export type Content = {
  getContentTree(): Promise<ContentNode[]>
  getVisibleDepth(): Promise<number>
  getDoc(slug: string[]): Promise<ContentDoc | null>
  getAllDocSlugs(): Promise<string[][]>
}

export function createContent(source: ContentSource): Content {
  async function readFolderConfig(dir: string[]): Promise<FolderConfig> {
    for (const name of CONFIG_BASENAMES) {
      const raw = await source.readFile([...dir, name])
      if (raw === null) continue

      try {
        const parsed = parseYaml(raw)
        return parsed && typeof parsed === 'object' ? (parsed as FolderConfig) : {}
      } catch {
        return {}
      }
    }

    return {}
  }

  async function readFrontmatter(file: string[]): Promise<Frontmatter> {
    const raw = await source.readFile(file)
    if (raw === null) return {}

    try {
      const { data } = matter(raw, MATTER_OPTIONS)
      return data ?? {}
    } catch {
      return {}
    }
  }

  async function buildTree(dir: string[], slug: string[], inheritedOrdering: Ordering): Promise<ContentNode[]> {
    const config = await readFolderConfig(dir)
    const ordering = config.ordering ?? inheritedOrdering
    const direction = config.direction ?? defaultDirection(ordering)
    const nodes: ContentNode[] = []

    for (const entry of await source.readDir(dir)) {
      if (isHiddenEntry(entry.name)) continue

      const full = [...dir, entry.name]

      if (entry.isDirectory) {
        const { order, rest } = stripPrefix(entry.name)
        const childConfig = await readFolderConfig(full)
        if (childConfig.hidden) continue

        const childSlug = [...slug, rest]
        nodes.push({
          slug: childSlug,
          href: '/' + childSlug.join('/'),
          title: childConfig.title ?? titleFromSlug(rest),
          order,
          date: null,
          isFolder: true,
          children: await buildTree(full, childSlug, ordering),
        })
        continue
      }

      if (!isPageFile(entry.name) || isIndexFile(entry.name)) continue

      const { order, rest } = stripPrefix(entry.name)
      const name = stripExtension(rest)
      const front = await readFrontmatter(full)
      const childSlug = [...slug, name]

      nodes.push({
        slug: childSlug,
        href: '/' + childSlug.join('/'),
        title: front.title ?? titleFromSlug(name),
        order,
        date: normalizeDate(front.date),
        isFolder: false,
        children: [],
      })
    }

    return sortNodes(nodes, ordering, direction)
  }

  async function resolveFile(slug: string[]): Promise<string[] | null> {
    const walk = async (dir: string[], remaining: string[]): Promise<string[] | null> => {
      const entries = await source.readDir(dir)

      if (remaining.length === 0) {
        for (const entry of entries) {
          if (!entry.isDirectory && isPageFile(entry.name) && isIndexFile(entry.name)) {
            return [...dir, entry.name]
          }
        }
        return null
      }

      const [head, ...tail] = remaining

      if (tail.length === 0) {
        for (const entry of entries) {
          if (entry.isDirectory || !isPageFile(entry.name)) continue
          const { rest } = stripPrefix(entry.name)
          if (stripExtension(rest) === head) return [...dir, entry.name]
        }
      }

      for (const entry of entries) {
        if (!entry.isDirectory) continue
        if (stripPrefix(entry.name).rest !== head) continue
        return walk([...dir, entry.name], tail)
      }

      return null
    }

    return walk([], slug)
  }

  async function getContentTree(): Promise<ContentNode[]> {
    const rootConfig = await readFolderConfig([])
    return buildTree([], [], rootConfig.ordering ?? DEFAULT_ORDERING)
  }

  async function getVisibleDepth(): Promise<number> {
    const configured = (await readFolderConfig([])).depth
    return typeof configured === 'number' && configured > 0 ? configured : DEFAULT_VISIBLE_DEPTH
  }

  async function getDoc(slug: string[]): Promise<ContentDoc | null> {
    const file = await resolveFile(slug)
    if (!file) return null

    const raw = await source.readFile(file)
    if (raw === null) return null

    const { data, content } = matter(raw, MATTER_OPTIONS)
    const last = slug.at(-1)

    return {
      slug,
      href: '/' + slug.join('/'),
      title: data.title ?? (last ? titleFromSlug(last) : 'Introduction'),
      description: data.description ?? null,
      date: normalizeDate(data.date),
      body: content,
    }
  }

  async function getAllDocSlugs(): Promise<string[][]> {
    const slugs: string[][] = []

    const walk = async (nodes: ContentNode[]) => {
      for (const node of nodes) {
        if (node.isFolder) {
          if (await resolveFile(node.slug)) slugs.push(node.slug)
          await walk(node.children)
        } else {
          slugs.push(node.slug)
        }
      }
    }

    await walk(await getContentTree())
    if (await resolveFile([])) slugs.push([])

    return slugs
  }

  return { getContentTree, getVisibleDepth, getDoc, getAllDocSlugs }
}

export const CONTENT_ROOT = locateContentRoot('origin')

const content = createContent(createFsSource(CONTENT_ROOT))

export const getContentTree = content.getContentTree
export const getVisibleDepth = content.getVisibleDepth
export const getDoc = content.getDoc
export const getAllDocSlugs = content.getAllDocSlugs
