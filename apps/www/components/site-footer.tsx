import { siteConfig } from '@/lib/config'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Built by{' '}
          <a href={siteConfig.links.github} className="text-foreground underline-offset-4 hover:underline">
            {siteConfig.author}
          </a>
          .
        </p>
        <p className="font-mono text-xs">{siteConfig.url}</p>
      </div>
    </footer>
  )
}
