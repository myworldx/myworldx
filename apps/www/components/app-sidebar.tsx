'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftIcon, ChevronLeftIcon } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@myworldx/ui/components/sidebar'
import { cn } from '@myworldx/ui/lib/utils'

import { siteConfig } from '@/lib/config'
import type { ContentNode } from '@/lib/content'
import { buildSidebarView, type SidebarEntry } from '@/lib/sidebar'
import { SiteLogo } from '@/components/site-logo'
import { ThemeToggle } from '@/components/theme-toggle'

const ROW = 'text-sm data-[size=md]:text-sm'

function Marker({ isFolder, isOpen }: { isFolder: boolean; isOpen: boolean }) {
  if (!isFolder) {
    return (
      <span className="ms-auto flex size-4 shrink-0 items-center justify-center">
        <span className="size-1 rounded-full bg-current opacity-40" />
      </span>
    )
  }

  return (
    <ChevronLeftIcon
      aria-hidden
      className={cn(
        'ms-auto shrink-0 opacity-40 transition-transform duration-300 ease-out motion-reduce:transition-none',
        isOpen && '-rotate-90'
      )}
    />
  )
}

function useCollapsed(pathname: string) {
  const [state, setState] = useState({ pathname, hrefs: [] as string[] })
  const hrefs = state.pathname === pathname ? state.hrefs : []

  const isCollapsed = (href: string) => hrefs.includes(href)
  const toggle = (href: string) =>
    setState({
      pathname,
      hrefs: hrefs.includes(href) ? hrefs.filter((item) => item !== href) : [...hrefs, href],
    })

  return { isCollapsed, toggle }
}

function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      inert={!open}
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none',
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

type BranchProps = {
  entries: SidebarEntry[]
  isCollapsed: (href: string) => boolean
  toggle: (href: string) => void
}

function Branch({ entries, isCollapsed, toggle }: BranchProps) {
  if (entries.length === 0) return null

  return (
    <SidebarMenuSub>
      {entries.map((entry) => {
        const open = entry.children.length > 0 && !isCollapsed(entry.href)

        return (
          <SidebarMenuSubItem key={entry.href}>
            <SidebarMenuSubButton
              className={cn(ROW, '[&>svg]:text-sidebar-foreground')}
              isActive={entry.isActive}
              onClick={(event) => {
                if (!entry.isActive || entry.children.length === 0) return
                event.preventDefault()
                toggle(entry.href)
              }}
              render={<Link href={entry.href} />}
            >
              <span className="min-w-0 flex-1 truncate">{entry.title}</span>
              <Marker isFolder={entry.isFolder} isOpen={open} />
            </SidebarMenuSubButton>
            <Collapse open={open}>
              <Branch entries={entry.children} isCollapsed={isCollapsed} toggle={toggle} />
            </Collapse>
          </SidebarMenuSubItem>
        )
      })}
    </SidebarMenuSub>
  )
}

export function AppSidebar({
  tree,
  visibleDepth,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  tree: ContentNode[]
  visibleDepth: number
}) {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useCollapsed(pathname)
  const view = buildSidebarView(tree, pathname, visibleDepth)

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:hidden">
          <Link href="/" aria-label={siteConfig.name} className="rounded-md px-2 py-1.5">
            <SiteLogo className="block text-lg text-bold w-full max-w-[6.5rem]" />
          </Link>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {view.sections.map((section) => {
                const expanded = section.isOpen && !isCollapsed(section.href)

                return (
                  <SidebarMenuItem key={section.href}>
                    <SidebarMenuButton
                      className={ROW}
                      isActive={section.isActive}
                      onClick={(event) => {
                        if (!section.isActive || !section.isOpen) return
                        event.preventDefault()
                        toggle(section.href)
                      }}
                      render={<Link href={section.href} />}
                    >
                      <span className="min-w-0 flex-1 truncate">{section.title}</span>
                      <Marker isFolder={section.isFolder} isOpen={expanded} />
                    </SidebarMenuButton>

                    <Collapse open={expanded}>
                      {section.back ? (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              className={cn(ROW, 'text-muted-foreground')}
                              render={<Link href={section.back.href} />}
                            >
                              <ArrowLeftIcon />
                              <span className="truncate">{section.back.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      ) : null}

                      <Branch entries={section.items} isCollapsed={isCollapsed} toggle={toggle} />
                    </Collapse>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <span className="px-2 py-1 text-xs text-muted-foreground">{siteConfig.url.replace('https://', '')}</span>
      </SidebarFooter>
    </Sidebar>
  )
}
