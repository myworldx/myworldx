'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { site } from '@/config/site'
import { cn } from '@/server/lib/cn'
import { Icons } from '@/client/components/icons'
import { fonts } from '@/server/lib/fonts'
import { buttonVariants } from '../ui/button'
import { Separator } from '../separator'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="hidden items-center gap-8 md:flex">
      <div className="flex h-8 items-center space-x-2">
        <Link href="/home">
          <Icons.LogoColorAnimated className="h-8 animate-fade-left fill-foreground" />
        </Link>
        <Separator decorative className="h-8  rotate-6 rounded-full bg-foreground" orientation="vertical" />
        <Link
          href="/"
          className={cn(
            'flex animate-fade-right text-xl font-extrabold leading-4 tracking-tighter text-foreground',
            fonts.title.className,
          )}
        >
          {site.name}
        </Link>
      </div>
    </div>
  )
}
