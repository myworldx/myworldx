import { cn } from '@myworldx/ui/lib/utils'

import { siteConfig } from '@/lib/config'

export function SiteLogo({ className }: { className?: string }) {
  return <span className={cn('font-mono font-medium tracking-tight', className)}>{siteConfig.name}</span>
}
