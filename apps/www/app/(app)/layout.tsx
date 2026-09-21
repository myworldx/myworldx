import { SidebarInset, SidebarProvider } from '@myworldx/ui/components/sidebar'

import { getContentTree, getVisibleDepth } from '@/lib/content'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [tree, visibleDepth] = await Promise.all([getContentTree(), getVisibleDepth()])

  return (
    <SidebarProvider>
      <AppSidebar tree={tree} visibleDepth={visibleDepth} variant="inset" />
      <SidebarInset className="md:h-[calc(100svh-0.5rem)] md:overflow-y-auto md:border-s md:border-t md:[scrollbar-gutter:stable] md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:mt-2 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:rounded-tl-xl md:peer-data-[variant=inset]:shadow-none">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
          <SiteHeader />
          <div className="flex flex-1 gap-8">{children}</div>
          <SiteFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
