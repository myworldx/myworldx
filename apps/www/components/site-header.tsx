'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@myworldx/ui/components/breadcrumb'
import { SidebarTrigger } from '@myworldx/ui/components/sidebar'

function titleFromSegment(segment: string): string {
  return segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function SiteHeader() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <SidebarTrigger className="-ms-1 md:hidden" />
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const href = '/' + segments.slice(0, index + 1).join('/')
            const isLast = index === segments.length - 1

            return (
              <Fragment key={href}>
                {index > 0 ? <BreadcrumbSeparator className="hidden md:block" /> : null}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{titleFromSegment(segment)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={href} />}>{titleFromSegment(segment)}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
