import remarkGfm from 'remark-gfm'
import remarkEmogi from 'remark-emoji'

import { serialize } from 'next-mdx-remote/serialize'

export const MdxSource = async () => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/raferdev/raferdev/main/README.md', {
      next: { revalidate: 0 },
    })
    const text = await res.text()

    return await serialize(text, {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkEmogi],
        format: 'md',
      },
      parseFrontmatter: false,
    }).then((source) => source)
  } catch (error) {
    console.error(error, 'error serialize markdown')
  }
}
