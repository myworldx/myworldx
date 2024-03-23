import '@/client/styles/globals.css'

import { cn } from '@/server/lib/cn'
import { fonts } from '@/server/lib/fonts'
import { ReactChildren } from '@/@types/react'
import { SiteHeader } from '@/client/components/site-header'
import { ThemeProvider } from '@/client/components/providers'
import { Footer } from '@/client/components/footer'

export default function RootLayout({ children }: ReactChildren) {
  return (
    <>
      <html lang="en">
        <body
          className={cn('relative flex min-h-screen flex-col bg-background text-lg antialiased', fonts.sans.className)}
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <SiteHeader />
            <main className="flex flex-1 flex-col items-center justify-center">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
