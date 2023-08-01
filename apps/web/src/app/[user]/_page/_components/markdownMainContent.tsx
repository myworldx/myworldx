import { MDXRemote } from 'next-mdx-remote/rsc'

export async function MarkdownMainContent() {
  const res = await fetch('https://raw.githubusercontent.com/raferdev/raferdev/main/README.md', {
    next: { revalidate: 3600 },
  })
  const markdown = await res.text()

  return <MDXRemote source={markdown} />
}
