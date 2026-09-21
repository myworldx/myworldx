import type { MDXComponents } from 'mdx/types'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

import { Button } from '@myworldx/ui/components/button'
import { Separator } from '@myworldx/ui/components/separator'

import { slugifyHeading } from '@/lib/content'

function headingId(children: React.ReactNode): string | undefined {
  return typeof children === 'string' ? slugifyHeading(children) : undefined
}

const components: MDXComponents = {
  h1: ({ children }) => <h1 className="scroll-m-20 text-3xl font-semibold text-balance">{children}</h1>,
  h2: ({ children }) => (
    <h2
      id={headingId(children)}
      className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold text-balance first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingId(children)} className="mt-8 scroll-m-20 text-xl font-semibold text-balance">
      {children}
    </h3>
  ),
  h4: ({ children }) => <h4 className="mt-6 scroll-m-20 text-lg font-medium text-balance">{children}</h4>,
  p: ({ children }) => <p className="mt-5 text-base text-pretty">{children}</p>,
  ul: ({ children }) => (
    <ul className="mt-5 ml-5 flex list-disc flex-col gap-2 marker:text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 ml-5 flex list-decimal flex-col gap-2 marker:text-muted-foreground">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1.5 text-base text-pretty">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-current/35 underline-offset-4 transition-colors hover:decoration-primary"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  hr: () => <hr className="my-10" />,
  code: ({ children }) => (
    <code className="relative rounded-sm bg-muted px-[0.3em] py-[0.15em] font-mono text-[0.875em]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mt-5 overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm">{children}</pre>
  ),
  table: ({ children }) => (
    <div className="mt-5 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b px-4 py-2.5 text-left font-medium">{children}</th>,
  td: ({ children }) => <td className="border-b px-4 py-2.5 text-muted-foreground last:border-0">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="mt-5 border-s-2 border-primary/30 ps-4 text-muted-foreground italic">{children}</blockquote>
  ),
  Button,
  Separator,
}

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
}
