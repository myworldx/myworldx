import { M_PLUS_1 } from 'next/font/google'
import { UserProfileImageHeader } from './_components/userProfileImageHeader'
import App from '@/lib/octokit'
import { parse } from 'node-html-parser'

const logoFont = M_PLUS_1({
  weight: '800',
  subsets: ['latin'],
})

export default async function UserPage({ params }: { params: { user: string } }) {
  const url = 'https://raw.githubusercontent.com/raferdev/raferdev/main/'

  const RawMarkdown = await fetch('https://raw.githubusercontent.com/raferdev/raferdev/main/README.md')

  const octokit = await App.getInstallationOctokit(40324534)

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
    <div className="flex h-screen w-screen flex-col pt-[150px]">
      <header className="fixed right-0 top-0 flex h-[150px] w-full items-center justify-center shadow-sm	">
        <div className="flex items-center justify-center">
          <div className="relative z-10 mr-[-20px] flex h-[120px] w-[120px] items-center justify-center rounded-full border-[10px] border-gray-950">
            <div className="absolute left-0 top-0 -z-0 box-content"></div>
            <UserProfileImageHeader />
          </div>
          <h1
            className={`${logoFont.className} bg-gradient-to-r from-neutral-950 to-slate-900 bg-clip-text p-1 text-[80px] tracking-[-0.1em] text-transparent`}
          >
            Raferdev
          </h1>
        </div>
      </header>
      <div className="h-full w-full flex items-center flex-col p-8">
        <article className="flex items-start flex-col w-full" dangerouslySetInnerHTML={{ __html }}></article>
      </div>
    </div>
  )
}
