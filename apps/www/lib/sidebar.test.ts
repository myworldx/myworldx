import { describe, expect, it } from 'vitest'

import type { ContentNode } from '@/lib/content'
import { buildSidebarView, type SidebarEntry } from '@/lib/sidebar'

function folder(slug: string[], children: ContentNode[] = []): ContentNode {
  return {
    slug,
    href: '/' + slug.join('/'),
    title: slug.at(-1) ?? 'root',
    order: null,
    date: null,
    isFolder: true,
    children,
  }
}

function page(slug: string[]): ContentNode {
  return { ...folder(slug), isFolder: false, children: [] }
}

const tree: ContentNode[] = [
  folder(
    ['blog'],
    [
      page(['blog', 'hello']),
      folder(
        ['blog', 'physics'],
        [
          page(['blog', 'physics', 'leaf']),
          folder(
            ['blog', 'physics', 'geometry'],
            [
              folder(
                ['blog', 'physics', 'geometry', 'euclidean'],
                [
                  folder(
                    ['blog', 'physics', 'geometry', 'euclidean', 'history'],
                    [
                      folder(
                        ['blog', 'physics', 'geometry', 'euclidean', 'history', 'antiquity'],
                        [page(['blog', 'physics', 'geometry', 'euclidean', 'history', 'antiquity', 'greece'])]
                      ),
                    ]
                  ),
                ]
              ),
            ]
          ),
        ]
      ),
      folder(['blog', 'chemistry'], [page(['blog', 'chemistry', 'atoms'])]),
    ]
  ),
  folder(['guides'], [page(['guides', 'install'])]),
  page(['about']),
]

function openSection(pathname: string, depth = 3) {
  const view = buildSidebarView(tree, pathname, depth)
  return view.sections.find((s) => s.isOpen) ?? null
}

function levels(entries: SidebarEntry[]): string[][] {
  const out: string[][] = []
  const walk = (list: SidebarEntry[], d: number) => {
    if (list.length === 0) return
    out[d] = [...(out[d] ?? []), ...list.map((e) => e.href)]
    list.forEach((e) => walk(e.children, d + 1))
  }
  walk(entries, 0)
  return out
}

describe('buildSidebarView', () => {
  it('always lists every top-level section', () => {
    for (const path of [
      '/',
      '/blog',
      '/blog/physics',
      '/blog/physics/geometry/euclidean/history/antiquity/greece',
      '/guides/install',
    ]) {
      const view = buildSidebarView(tree, path, 3)
      expect(
        view.sections.map((s) => s.href),
        `at ${path}`
      ).toEqual(['/blog', '/guides', '/about'])
    }
  })

  it('opens only the section you are inside', () => {
    const view = buildSidebarView(tree, '/blog/physics', 3)
    expect(view.sections.filter((s) => s.isOpen).map((s) => s.href)).toEqual(['/blog'])
    expect(view.sections.find((s) => s.href === '/guides')?.items).toEqual([])
  })

  it('opens no section at the root', () => {
    const view = buildSidebarView(tree, '/', 3)
    expect(view.sections.every((s) => !s.isOpen)).toBe(true)
  })

  it('distinguishes folders from pages', () => {
    const view = buildSidebarView(tree, '/blog', 3)
    expect(view.sections.find((s) => s.href === '/about')?.isFolder).toBe(false)
    expect(view.sections.find((s) => s.href === '/blog')?.isFolder).toBe(true)

    const open = openSection('/blog')
    const hello = open?.items.find((i) => i.href === '/blog/hello')
    const physics = open?.items.find((i) => i.href === '/blog/physics')
    expect(hello?.isFolder).toBe(false)
    expect(physics?.isFolder).toBe(true)
  })

  it('shows the children of the folder you are standing on', () => {
    for (const [path, child] of [
      ['/blog', '/blog/physics'],
      ['/blog/physics', '/blog/physics/geometry'],
      ['/blog/physics/geometry', '/blog/physics/geometry/euclidean'],
      ['/blog/physics/geometry/euclidean', '/blog/physics/geometry/euclidean/history'],
      ['/blog/physics/geometry/euclidean/history', '/blog/physics/geometry/euclidean/history/antiquity'],
    ] as const) {
      const open = openSection(path)
      expect(levels(open?.items ?? []).flat(), `standing on ${path}`).toContain(child)
    }
  })

  it('keeps the current page visible however deep it is', () => {
    const deep = '/blog/physics/geometry/euclidean/history/antiquity/greece'
    const open = openSection(deep)
    expect(levels(open?.items ?? []).flat()).toContain(deep)
  })

  it('never renders more levels than the window allows', () => {
    for (const path of [
      '/blog',
      '/blog/physics',
      '/blog/physics/geometry/euclidean',
      '/blog/physics/geometry/euclidean/history/antiquity/greece',
    ]) {
      const open = openSection(path)
      expect(levels(open?.items ?? []).length, `at ${path}`).toBeLessThanOrEqual(3)
    }
  })

  it('windows relative to the section, not absolute depth', () => {
    const open = openSection('/blog/physics/geometry/euclidean')
    expect(open?.back).toEqual({ href: '/blog/physics', title: 'physics' })
    expect(levels(open?.items ?? [])).toEqual([
      ['/blog/physics/leaf', '/blog/physics/geometry'],
      ['/blog/physics/geometry/euclidean'],
      ['/blog/physics/geometry/euclidean/history'],
    ])
  })

  it('needs no back row until the window slides inside the section', () => {
    expect(openSection('/blog')?.back).toBeNull()
    expect(openSection('/blog/physics')?.back).toBeNull()
    expect(openSection('/blog/physics/geometry')?.back).toBeNull()
    expect(openSection('/blog/physics/geometry/euclidean')?.back).toEqual({
      href: '/blog/physics',
      title: 'physics',
    })
  })

  it('keeps siblings visible and expands only the active branch', () => {
    const open = openSection('/blog/physics/geometry')
    const hrefs = open?.items.map((i) => i.href) ?? []
    expect(hrefs).toContain('/blog/chemistry')
    expect(hrefs).toContain('/blog/physics')

    const chemistry = open?.items.find((i) => i.href === '/blog/chemistry')
    const physics = open?.items.find((i) => i.href === '/blog/physics')
    expect(chemistry?.children).toEqual([])
    expect(physics?.children.map((c) => c.href)).toContain('/blog/physics/geometry')
  })

  it('marks the current page active and its ancestors as ancestors', () => {
    const open = openSection('/blog/physics/geometry')
    const physics = open?.items.find((i) => i.href === '/blog/physics')
    const geometry = physics?.children.find((c) => c.href === '/blog/physics/geometry')

    expect(physics?.isAncestor).toBe(true)
    expect(physics?.isActive).toBe(false)
    expect(geometry?.isActive).toBe(true)
    expect(geometry?.isAncestor).toBe(false)
  })

  it('marks a section active only when it is the current page', () => {
    expect(buildSidebarView(tree, '/blog', 3).sections.find((s) => s.href === '/blog')?.isActive).toBe(true)
    expect(buildSidebarView(tree, '/blog/physics', 3).sections.find((s) => s.href === '/blog')?.isActive).toBe(false)
  })

  it('falls back to the deepest resolvable folder for an unknown path', () => {
    const open = openSection('/blog/physics/nope/deeper/still')
    expect(open?.back).toEqual({ href: '/blog/physics', title: 'physics' })
  })

  it('honours a different window size', () => {
    const deep = '/blog/physics/geometry/euclidean/history'
    expect(levels(openSection(deep, 2)?.items ?? []).length).toBe(2)
    expect(levels(openSection(deep, 5)?.items ?? []).length).toBe(5)
  })
})
