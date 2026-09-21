import type { ContentNode } from '@/lib/content'

export const DEFAULT_VISIBLE_DEPTH = 3

export type SidebarEntry = {
  href: string
  title: string
  isFolder: boolean
  isActive: boolean
  isAncestor: boolean
  hasChildren: boolean
  children: SidebarEntry[]
}

export type SidebarSection = {
  href: string
  title: string
  isFolder: boolean
  isActive: boolean
  isOpen: boolean
  back: { href: string; title: string } | null
  items: SidebarEntry[]
}

export type SidebarView = {
  sections: SidebarSection[]
}

function segmentsOf(pathname: string): string[] {
  return pathname.split('/').filter(Boolean)
}

function descend(node: ContentNode, segments: string[]): ContentNode | null {
  let current: ContentNode | null = null
  let level = node.children

  for (const segment of segments) {
    const match: ContentNode | undefined = level.find((child) => child.slug.at(-1) === segment)
    if (!match) break
    current = match
    level = match.children
  }

  return current
}

function toEntry(node: ContentNode, activeSegments: string[], remainingDepth: number): SidebarEntry {
  const depth = node.slug.length
  const matchesPath =
    depth <= activeSegments.length && node.slug.every((segment, index) => activeSegments[index] === segment)
  const isActive = matchesPath && depth === activeSegments.length
  const expand = matchesPath && remainingDepth > 1 && node.children.length > 0

  return {
    href: node.href,
    title: node.title,
    isFolder: node.isFolder,
    isActive,
    isAncestor: matchesPath && !isActive,
    hasChildren: node.children.length > 0,
    children: expand ? node.children.map((child) => toEntry(child, activeSegments, remainingDepth - 1)) : [],
  }
}

export function buildSidebarView(
  tree: ContentNode[],
  pathname: string,
  visibleDepth: number = DEFAULT_VISIBLE_DEPTH
): SidebarView {
  const depth = Math.max(1, visibleDepth)
  const activeSegments = segmentsOf(pathname)
  const openSegment = activeSegments[0]

  const sections = tree.map((node) => {
    const isOpen = node.slug.at(-1) === openSegment
    const isActive = isOpen && activeSegments.length === 1

    if (!isOpen || !node.isFolder) {
      return {
        href: node.href,
        title: node.title,
        isFolder: node.isFolder,
        isActive,
        isOpen: false,
        back: null,
        items: [],
      }
    }

    const inner = activeSegments.slice(1)
    const focusDepth = Math.max(0, inner.length - depth + 1)
    const focus = focusDepth > 0 ? descend(node, inner.slice(0, focusDepth)) : null
    const roots = focus ? focus.children : node.children

    return {
      href: node.href,
      title: node.title,
      isFolder: node.isFolder,
      isActive,
      isOpen: true,
      back: focus ? { href: focus.href, title: focus.title } : null,
      items: roots.map((child) => toEntry(child, activeSegments, depth)),
    }
  })

  return { sections }
}
