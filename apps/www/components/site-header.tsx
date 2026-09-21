import { SiteLogo } from '@/components/site-logo'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <SiteLogo />
        <ThemeToggle />
      </div>
    </header>
  )
}
