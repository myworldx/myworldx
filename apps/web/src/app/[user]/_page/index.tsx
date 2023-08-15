import { Roboto } from 'next/font/google'

import Link from 'next/link'

import { parse } from 'node-html-parser'
import App from '@/lib/octokit'

const bodyFont = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export default async function UserPage({ params }: { params: { user: string } }) {
  const url = 'https://raw.githubusercontent.com/raferdev/raferdev/main/'

  const RawMarkdown = await fetch('https://raw.githubusercontent.com/raferdev/raferdev/main/README.md')

  const octokit = await App.getInstallationOctokit(40479142)

  const { data: HtmlMarkdown } = await octokit.request('POST /markdown', {
    text: await RawMarkdown.text(),
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  const rawParsedHtmlMarkdownInnerHtml = parse(HtmlMarkdown).innerHTML

  const replacer = (match: string) => {
    if (!match.includes('src="https://') && !match.includes("src='https://")) {
      if (match.includes('src="./')) {
        return match.replace('src="./', `src="${url}`)
      }
      if (match.includes("src='./")) {
        return match.replace("src='./", `src='${url}`)
      }

      if (match.includes('src="/')) {
        return match.replace('src="/', `src="${url}`)
      }
      if (match.includes("src='/")) {
        return match.replace("src='/", `src='${url}`)
      }

      if (match.includes('src="')) {
        return match.replace('src="', `src="${url}`)
      }
      if (match.includes("src='")) {
        return match.replace("src='", `src="${url}`)
      }
    }
    return match
  }

  const __html = rawParsedHtmlMarkdownInnerHtml.replaceAll(/src=(["'])((?:\\\1|(?:(?!\1)).)*)(\1)/g, replacer)

  return (
    <div className="flex h-full w-full max-w-4xl flex-col items-center">
      <article
        className={`${bodyFont.className} flex w-full flex-col items-start`}
        dangerouslySetInnerHTML={{ __html }}
      ></article>
    </div>
  )
}
