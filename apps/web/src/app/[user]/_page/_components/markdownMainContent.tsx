'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { Suspense } from 'react'

export function MarkdownMainComponentt({ source }: { source: MDXRemoteSerializeResult }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MDXRemote {...source} />
    </Suspense>
  )
}
