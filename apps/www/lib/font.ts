import { DM_Mono as FontMono, DM_Sans as FontSans } from 'next/font/google'

import { cn } from '@myworldx/ui/lib/utils'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400'],
})

export const fontVariables = cn(fontSans.variable, fontMono.variable)
