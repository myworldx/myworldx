import { cn } from '@myworldx/ui/lib/utils'

import type { Heading } from '@/lib/content'

export function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null

  return (
    <aside className="sticky top-0 hidden h-[calc(100svh-1rem)] w-56 shrink-0 overflow-y-auto py-8 pe-6 xl:block">
      <p className="mb-3 text-sm font-medium text-foreground">On this page</p>
      <nav aria-label="On this page">
        <ul className="border-s text-sm">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  '-ms-px block border-s border-transparent py-1 text-muted-foreground transition-colors hover:text-foreground',
                  heading.depth === 2 ? 'ps-4' : 'ps-7'
                )}
              >
                {heading.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
