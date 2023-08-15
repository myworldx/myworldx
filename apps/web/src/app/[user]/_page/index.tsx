import { M_PLUS_1, Roboto } from 'next/font/google'

import Image from 'next/image'
import Link from 'next/link'

import { parse } from 'node-html-parser'
import App from '@/lib/octokit'

import LogoExtended from '@/public/myworldx_logo_ext.png'

import { UserProfileImageHeader } from './_components/userProfileImageHeader'

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

  const MainMenu = () => {
    const array = ['Home', 'Blog', 'About', 'Contact']
    return (
      <nav className="flex h-8 w-full items-center justify-center p-8 text-xl font-normal">
        <ul className="flex h-full w-full items-center justify-between gap-3">
          {array.map((item) => (
            <li className="max-ful">
              <Link href={`/${item}`}>
                <span>{item}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <>
      <header className="flex h-[170px] w-full items-center justify-between">
        <div className="flex items-center justify-center">
          <div className="relative z-10 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[3px] border-gray-950">
            <div className="absolute left-0 top-0 -z-0 box-content">
              <UserProfileImageHeader />
            </div>
          </div>
        </div>
        <div className="flex">
          <Image height={70} width={120} src={LogoExtended} alt="" />
        </div>
        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-[40px] w-[40px]" viewBox="0 0 512 512">
            <path
              d="M192 176v-40a40 40 0 0140-40h160a40 40 0 0140 40v240a40 40 0 01-40 40H240c-22.09 0-48-17.91-48-40v-40"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M288 336l80-80-80-80M80 256h272"
            />
          </svg>
        </div>
      </header>

      <MainMenu />

      <div className="flex h-full w-full max-w-4xl flex-col items-center">
        <article
          className={`${bodyFont.className} flex w-full flex-col items-start`}
          dangerouslySetInnerHTML={{ __html }}
        ></article>
      </div>
    </>
  )
}
