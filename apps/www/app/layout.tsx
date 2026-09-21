import type { Metadata } from 'next'

import '@myworldx/ui/globals.css'

import { Toaster } from '@myworldx/ui/components/sonner'
import { TooltipProvider } from '@myworldx/ui/components/tooltip'
import { cn } from '@myworldx/ui/lib/utils'

import { META_THEME_COLORS, siteConfig } from '@/lib/config'
import { fontVariables } from '@/lib/font'
import { ActiveThemeProvider } from '@/components/active-theme'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(fontVariables, 'antialiased')}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body className="flex min-h-svh flex-col overscroll-none bg-background text-foreground">
        <ThemeProvider>
          <ActiveThemeProvider>
            <TooltipProvider delay={0}>
              <SiteHeader />
              <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">{children}</main>
              <SiteFooter />
              <Toaster position="top-center" />
            </TooltipProvider>
            <TailwindIndicator />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
