import type { Metadata, Viewport } from 'next'

import '@myworldx/ui/globals.css'

import { Toaster } from '@myworldx/ui/components/sonner'
import { TooltipProvider } from '@myworldx/ui/components/tooltip'
import { cn } from '@myworldx/ui/lib/utils'

import { META_THEME_COLORS, siteConfig } from '@/lib/config'
import { fontVariables } from '@/lib/font'
import { ActiveThemeProvider } from '@/components/active-theme'
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: META_THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: META_THEME_COLORS.dark },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(fontVariables, 'antialiased')}>
      <body className="overscroll-none bg-background text-foreground">
        <ThemeProvider>
          <ActiveThemeProvider>
            <TooltipProvider delay={0}>
              {children}
              <Toaster position="top-center" />
            </TooltipProvider>
            <TailwindIndicator />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
