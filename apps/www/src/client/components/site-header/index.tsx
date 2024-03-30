'use client'

import Link from 'next/link'

import { cn } from '@/server/lib/cn'
import { Icons } from '@/client/components/icons'
import { MainNav } from '@/client/components/main-nav'
import { MobileNav } from '@/client/components/mobile-nav'
import { Toggle } from '@/client/components/toggle'
import { buttonVariants } from '@/client/components/ui/button'
import { usePathname } from 'next/navigation'
import { ModeToggle } from '../mode-toggle'

const SiteHeader = () => {
  return (
    <header className="supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex w-full justify-center  shadow-sm  backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <MainNav />
        {/*       <MobileNav />
         */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <div
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                  }),
                  'text-sm text-muted-foreground transition-colors hover:text-muted-foreground/80',
                )}
              >
                Login
              </div>
            </Link>
            <Link href="/login">
              <Icons.gitHub className="size-5  hover:text-muted-foreground/80" />
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
