import Link from 'next/link'

import { cn } from '@myworldx/ui/lib/utils'

import { siteConfig } from '@/lib/config'

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('font-mono text-sm font-medium tracking-tight', className)}>
      {siteConfig.name}
    </Link>
  )
}
