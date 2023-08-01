import { Metadata } from 'next'
import { LayoutDefaultProps } from '@/@types/layoutDefaultProps'

export const metadata: Metadata = {
  title: '...',
  description: '...',
}

export default function DefaultLayout({ children }: LayoutDefaultProps) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
